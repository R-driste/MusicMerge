"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebaseClient";
import { getUserOrganizations } from "@/lib/firebaseHelpers";

export function Navbar() {
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const [hasSuperAdminAccess, setHasSuperAdminAccess] = useState(false);

  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (!mounted) return;
      setIsSignedIn(!!user);

      if (user) {
        try {
          const orgs = await getUserOrganizations(user.uid);

          const isAdmin = orgs.some(
            (o) =>
              o.member.ApplicationStatus === "approved" &&
              (o.member.UserRole === "admin" || o.member.UserRole === "superadmin")
          );

          const isSuperAdmin = orgs.some(
            (o) =>
              o.member.ApplicationStatus === "approved" &&
              o.member.UserRole === "superadmin"
          );

          setHasAdminAccess(isAdmin);
          setHasSuperAdminAccess(isSuperAdmin);
        } catch {
          setHasAdminAccess(false);
          setHasSuperAdminAccess(false);
        }
      } else {
        setHasAdminAccess(false);
        setHasSuperAdminAccess(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    setIsSignedIn(false);
    setHasAdminAccess(false);
    setHasSuperAdminAccess(false);

    try { router.replace("/"); } catch (e) {}
    try { window.location.replace("/"); } catch (e) {}

    try {
      await signOut(firebaseAuth);
    } catch (e) {
      console.error("signOut error:", e);
    }
  };

  return (
    <nav className="bg-brand-navy sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-white">
              <Image src="/MM.png" alt="MusicMerge logo" width={60} height={60} />
            </Link>
          </div>

          {/* Nav Links */}
          <div className="flex gap-8">
            <Link href="/" className="text-white hover:text-gray-200">
              Home
            </Link>
            <Link href="/home/about" className="text-white hover:text-gray-200">
              About
            </Link>
            <Link href="/dash" className="text-white hover:text-gray-200">
              Dash
            </Link>
            <Link href="/home/contact" className="text-white hover:text-gray-200">
              Contact
            </Link>

            {isSignedIn && (
              <>
                <Link href="/profile" className="text-white hover:text-gray-300 transition-colors">
                  Profile
                </Link>
                <Link href="/itemsearch" className="text-white hover:text-gray-300 transition-colors">
                  Search for Your Items
                </Link>
                <Link href="/forms" className="text-white hover:text-gray-300 transition-colors">
                  Report/Claim Forms
                </Link>

                {/*admin*/}
                {hasAdminAccess && (
                  <Link href="/admin/dashboard" className="text-white hover:text-gray-300 transition-colors">
                    Admin
                  </Link>
                )}

                {/*superadmin */}
                {hasSuperAdminAccess && (
                  <Link href="/superadmin" className="text-white hover:text-gray-300 transition-colors">
                    App Admin
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="text-red-300 hover:text-red-400 font-bold transition-colors cursor-pointer ml-4"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}