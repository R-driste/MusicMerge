/**
 * Spotify API Helper Library
 * Handles authentication, playlist fetching, track searching, and playlist creation.
 */

// ─── Config ────────────────────────────────────────────────────────────────────

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI!;

const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

// Scopes needed for reading playlists and creating new ones
const SCOPES = [
  "user-read-email",
  "user-read-private",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-library-read",
].join(" ");

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface SpotifyTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface SpotifyUserProfile {
  id: string;
  display_name: string;
  email: string;
  images: { url: string }[];
  product: string;
  country: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { id: string; name: string }[];
  album: { id: string; name: string; images: { url: string }[] };
  duration_ms: number;
  uri: string;
  isrc?: string;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: { url: string }[];
  tracks: { total: number; href: string };
  owner: { id: string; display_name: string };
  public: boolean;
}

export interface SpotifyPlaylistDetails extends SpotifyPlaylist {
  tracks: {
    total: number;
    href: string;
    items: {
      added_at: string;
      track: SpotifyTrack;
    }[];
  };
}

// ─── Auth ──────────────────────────────────────────────────────────────────────

/**
 * Generate the Spotify OAuth authorization URL.
 * The `state` param prevents CSRF — store it in a cookie or session and verify on callback.
 */
export function getAuthUrl(state: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: SPOTIFY_CLIENT_ID,
    scope: SCOPES,
    redirect_uri: SPOTIFY_REDIRECT_URI,
    state,
    show_dialog: "true", // always show login dialog so users can switch accounts
  });

  return `${SPOTIFY_AUTH_URL}?${params.toString()}`;
}

/**
 * Exchange an authorization code for access + refresh tokens.
 */
export async function exchangeCodeForTokens(code: string): Promise<SpotifyTokens> {
  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Token exchange failed: ${error.error_description || error.error}`);
  }

  return response.json();
}

/**
 * Refresh an expired access token using the refresh token.
 */
export async function refreshAccessToken(refreshToken: string): Promise<SpotifyTokens> {
  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Token refresh failed: ${error.error_description || error.error}`);
  }

  const data = await response.json();

  // Spotify may or may not return a new refresh token
  return {
    ...data,
    refresh_token: data.refresh_token || refreshToken,
  };
}

// ─── API Helpers ───────────────────────────────────────────────────────────────

/**
 * Make an authenticated request to the Spotify API.
 * Throws on non-2xx responses with the error body.
 */
async function spotifyFetch<T>(
  endpoint: string,
  accessToken: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${SPOTIFY_API_BASE}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (response.status === 429) {
    const retryAfter = parseInt(response.headers.get("Retry-After") || "1", 10);
    throw new Error(`RATE_LIMITED:${retryAfter}`);
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: response.statusText } }));
    throw new Error(`Spotify API error (${response.status}): ${error.error?.message || response.statusText}`);
  }

  // Some endpoints return 204 No Content
  if (response.status === 204) return {} as T;

  return response.json();
}

/**
 * Wrapper that retries on rate limit (429) responses.
 */
async function spotifyFetchWithRetry<T>(
  endpoint: string,
  accessToken: string,
  options: RequestInit = {},
  maxRetries = 3
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await spotifyFetch<T>(endpoint, accessToken, options);
    } catch (error: any) {
      if (error.message?.startsWith("RATE_LIMITED:") && attempt < maxRetries) {
        const waitSeconds = parseInt(error.message.split(":")[1], 10);
        await new Promise((resolve) => setTimeout(resolve, waitSeconds * 1000));
        continue;
      }
      throw error;
    }
  }
  throw new Error("Max retries exceeded");
}

// ─── User ──────────────────────────────────────────────────────────────────────

/**
 * Get the current user's Spotify profile.
 */
export async function getUserProfile(accessToken: string): Promise<SpotifyUserProfile> {
  return spotifyFetchWithRetry<SpotifyUserProfile>("/me", accessToken);
}

// ─── Playlists ─────────────────────────────────────────────────────────────────

/**
 * Get all playlists for the current user (handles pagination).
 */
export async function getUserPlaylists(accessToken: string): Promise<SpotifyPlaylist[]> {
  const playlists: SpotifyPlaylist[] = [];
  let url: string | null = "/me/playlists?limit=50";

  while (url) {
    const response = await spotifyFetchWithRetry<{
      items: SpotifyPlaylist[];
      next: string | null;
    }>(url, accessToken);

    playlists.push(...response.items);
    url = response.next;
  }

  return playlists;
}

/**
 * Get all tracks in a playlist (handles pagination for playlists with 100+ tracks).
 */
export async function getPlaylistTracks(
  accessToken: string,
  playlistId: string
): Promise<SpotifyTrack[]> {
  const tracks: SpotifyTrack[] = [];
  let url: string | null = `/playlists/${playlistId}/tracks?limit=100&fields=items(added_at,track(id,name,uri,duration_ms,artists(id,name),album(id,name,images),external_ids)),next,total`;

  while (url) {
    const response = await spotifyFetchWithRetry<{
      items: { added_at: string; track: SpotifyTrack | null }[];
      next: string | null;
    }>(url, accessToken);

    // Filter out null tracks (can happen with local files or removed tracks)
    const validTracks = response.items
      .filter((item) => item.track !== null)
      .map((item) => item.track!);

    tracks.push(...validTracks);
    url = response.next;
  }

  return tracks;
}

/**
 * Get the user's Liked Songs (Saved Tracks). These aren't in a playlist.
 */
export async function getLikedSongs(accessToken: string): Promise<SpotifyTrack[]> {
  const tracks: SpotifyTrack[] = [];
  let url: string | null = "/me/tracks?limit=50";

  while (url) {
    const response = await spotifyFetchWithRetry<{
      items: { added_at: string; track: SpotifyTrack }[];
      next: string | null;
    }>(url, accessToken);

    tracks.push(...response.items.map((item) => item.track));
    url = response.next;
  }

  return tracks;
}

// ─── Search & Matching ─────────────────────────────────────────────────────────

/**
 * Search for a track on Spotify by name and artist.
 * Returns the best match or null if nothing is found.
 */
export async function searchTrack(
  accessToken: string,
  trackName: string,
  artistName: string,
  isrc?: string
): Promise<SpotifyTrack | null> {
  // If we have an ISRC, search by that first — it's the most reliable match
  if (isrc) {
    try {
      const isrcResult = await spotifyFetchWithRetry<{ tracks: { items: SpotifyTrack[] } }>(
        `/search?q=isrc:${encodeURIComponent(isrc)}&type=track&limit=1`,
        accessToken
      );
      if (isrcResult.tracks.items.length > 0) {
        return isrcResult.tracks.items[0];
      }
    } catch {
      // Fall through to text search
    }
  }

  // Fallback: search by track name + artist
  const query = `track:${trackName} artist:${artistName}`;
  const result = await spotifyFetchWithRetry<{ tracks: { items: SpotifyTrack[] } }>(
    `/search?q=${encodeURIComponent(query)}&type=track&limit=5`,
    accessToken
  );

  if (result.tracks.items.length === 0) return null;

  // Try to find an exact-ish match by comparing normalized names
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const targetTrack = normalize(trackName);
  const targetArtist = normalize(artistName);

  const bestMatch = result.tracks.items.find((item) => {
    const matchTrack = normalize(item.name) === targetTrack;
    const matchArtist = item.artists.some((a) => normalize(a.name) === targetArtist);
    return matchTrack && matchArtist;
  });

  return bestMatch || result.tracks.items[0];
}

/**
 * Search for multiple tracks in batch, respecting rate limits.
 * Returns an array of results in the same order as the input.
 */
export async function searchTracksBatch(
  accessToken: string,
  tracks: { name: string; artist: string; isrc?: string }[]
): Promise<(SpotifyTrack | null)[]> {
  const results: (SpotifyTrack | null)[] = [];
  const BATCH_DELAY_MS = 100; // small delay between requests to avoid rate limits

  for (const track of tracks) {
    const result = await searchTrack(accessToken, track.name, track.artist, track.isrc);
    results.push(result);

    // Small delay to stay within rate limits
    await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS));
  }

  return results;
}

// ─── Playlist Creation ─────────────────────────────────────────────────────────

/**
 * Create a new playlist on the user's account.
 */
export async function createPlaylist(
  accessToken: string,
  userId: string,
  name: string,
  description = "",
  isPublic = false
): Promise<SpotifyPlaylist> {
  return spotifyFetchWithRetry<SpotifyPlaylist>(
    `/users/${userId}/playlists`,
    accessToken,
    {
      method: "POST",
      body: JSON.stringify({
        name,
        description,
        public: isPublic,
      }),
    }
  );
}

/**
 * Add tracks to a playlist in batches of 100 (Spotify's limit per request).
 */
export async function addTracksToPlaylist(
  accessToken: string,
  playlistId: string,
  trackUris: string[]
): Promise<void> {
  const BATCH_SIZE = 100;

  for (let i = 0; i < trackUris.length; i += BATCH_SIZE) {
    const batch = trackUris.slice(i, i + BATCH_SIZE);

    await spotifyFetchWithRetry(
      `/playlists/${playlistId}/tracks`,
      accessToken,
      {
        method: "POST",
        body: JSON.stringify({ uris: batch }),
      }
    );
  }
}

// ─── Full Transfer Helper ──────────────────────────────────────────────────────

export interface TransferResult {
  playlistId: string;
  playlistUrl: string;
  totalTracks: number;
  matchedTracks: number;
  failedTracks: { name: string; artist: string }[];
}

/**
 * High-level function: takes a list of tracks (from Apple Music or anywhere),
 * searches for them on Spotify, creates a new playlist, and adds the matches.
 *
 * This is the core "import into Spotify" operation.
 */
export async function importPlaylistToSpotify(
  accessToken: string,
  userId: string,
  playlistName: string,
  tracks: { name: string; artist: string; isrc?: string }[],
  description?: string
): Promise<TransferResult> {
  // 1. Search for all tracks on Spotify
  const searchResults = await searchTracksBatch(accessToken, tracks);

  // 2. Separate matches from failures
  const matchedUris: string[] = [];
  const failedTracks: { name: string; artist: string }[] = [];

  searchResults.forEach((result, index) => {
    if (result) {
      matchedUris.push(result.uri);
    } else {
      failedTracks.push(tracks[index]);
    }
  });

  // 3. Create the playlist
  const playlist = await createPlaylist(
    accessToken,
    userId,
    playlistName,
    description || `Transferred via PlaylistSync — ${matchedUris.length}/${tracks.length} tracks matched`,
    false
  );

  // 4. Add matched tracks
  if (matchedUris.length > 0) {
    await addTracksToPlaylist(accessToken, playlist.id, matchedUris);
  }

  return {
    playlistId: playlist.id,
    playlistUrl: `https://open.spotify.com/playlist/${playlist.id}`,
    totalTracks: tracks.length,
    matchedTracks: matchedUris.length,
    failedTracks,
  };
}
