/**
 * GET /api/auth/spotify/callback
 *
 * Spotify redirects here after the user grants (or denies) permission.
 * Exchanges the authorization code for tokens, fetches the user profile,
 * stores everything in Firebase, and sets a session cookie.
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeCodeForTokens, getUserProfile } from "@/lib/spotify";
import { saveSpotifyTokens } from "@/lib/firebase";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const cookieStore = await cookies();
  const storedState = cookieStore.get("spotify_auth_state")?.value;

  // Clean up the state cookie regardless of outcome
  cookieStore.delete("spotify_auth_state");

  // ── Error cases ────────────────────────────────────────────────────────────

  if (error) {
    // User denied access or something went wrong on Spotify's end
    const redirectUrl = new URL("/login", request.nextUrl.origin);
    redirectUrl.searchParams.set("error", error);
    return NextResponse.redirect(redirectUrl);
  }

  if (!code || !state) {
    return NextResponse.json({ error: "Missing code or state parameter" }, { status: 400 });
  }

  if (state !== storedState) {
    return NextResponse.json({ error: "State mismatch — possible CSRF attack" }, { status: 403 });
  }

  // ── Token exchange ─────────────────────────────────────────────────────────

  try {
    // Exchange the authorization code for tokens
    const tokens = await exchangeCodeForTokens(code);

    // Fetch the user's Spotify profile
    const profile = await getUserProfile(tokens.access_token);

    // Store tokens and profile in Firebase
    await saveSpotifyTokens(
      profile.id,
      {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_in: tokens.expires_in,
        scope: tokens.scope,
      },
      {
        display_name: profile.display_name,
        email: profile.email,
      }
    );

    // Set a session cookie with the Spotify user ID
    // In production you'd use a proper session token (JWT or encrypted cookie)
    cookieStore.set("spotify_user_id", profile.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    // Redirect to the dashboard
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl.origin));
  } catch (err: any) {
    console.error("Spotify auth callback error:", err);

    const redirectUrl = new URL("/login", request.nextUrl.origin);
    redirectUrl.searchParams.set("error", "auth_failed");
    return NextResponse.redirect(redirectUrl);
  }
}
