/**
 * GET /api/auth/spotify
 *
 * Redirects the user to Spotify's OAuth consent screen.
 * Generates a random `state` param and stores it in a cookie for CSRF protection.
 */
 
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { getAuthUrl } from "@/lib/spotify";
 
export async function GET() {
  // Generate a random state value for CSRF protection
  const state = randomBytes(16).toString("hex");
 
  // Store the state in an HttpOnly cookie so we can verify it on callback
  const cookieStore = await cookies();
  cookieStore.set("spotify_auth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes — plenty of time to complete login
    path: "/",
  });
 
  const authUrl = getAuthUrl(state);
 
  return NextResponse.redirect(authUrl);
}
