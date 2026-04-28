"use client";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  // create client to ensure library initialisation in the browser
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    )
  );

  // We don't rely on SessionContextProvider from auth-helpers (not exported
  // in this package build). Other components use `useSupabaseClient` which
  // creates its own browser client. This component simply ensures the
  // client is initialised on mount.
  return <>{children}</>;
}
