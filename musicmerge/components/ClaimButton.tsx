"use client";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc } from "firebase/firestore";
import { firebaseAuth, firebaseDb } from "@/lib/firebaseClient";
import { getClaimsByItem, addClaim, type Claim } from "@/lib/firebaseHelpers";

type ClaimRecord = {
  id: string;
  userName?: string;
  userEmail?: string;
};

export default function ClaimButton({ item }: { item: any }) {
  const [loading, setLoading] = useState(false);
  const [claimedBy, setClaimedBy] = useState<ClaimRecord[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [itemRef, setItemRef] = useState<any>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, (user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!item?.id || !item?.orgId) return;

    let cancelled = false;
    const load = async () => {
      try {
        // Create reference to the item in Organizations/{orgId}/Items/{itemId}
        const ref = doc(firebaseDb, "Organizations", item.orgId, "Items", item.id);
        setItemRef(ref);

        // Get claims for this item
        const claims: Claim[] = await getClaimsByItem(ref);

        if (cancelled) return;

        // Load user info for each claim
        const claimRecords: ClaimRecord[] = await Promise.all(
          claims.map(async (claim) => {
            try {
              const userDoc = await claim.ClaimUser.get();
              if (userDoc.exists()) {
                const userData = userDoc.data();
                return {
                  id: claim.id,
                  userName: userData.UserName || userData.UserEmail,
                  userEmail: userData.UserEmail,
                };
              }
              return { id: claim.id };
            } catch (e) {
              console.error("Error loading user for claim", e);
              return { id: claim.id };
            }
          })
        );

        setClaimedBy(claimRecords);
      } catch (e) {
        console.error("load claimers", e);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [item]);

  const handleClaim = async () => {
    if (!item?.id || !item?.orgId) {
      alert("This item cannot be claimed.");
      return;
    }
    if (!currentUser) {
      alert("You must be logged in to claim an item.");
      return;
    }
    if (!itemRef) {
      alert("Item reference not loaded. Please try again.");
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(firebaseDb, "Users", currentUser.uid);

      await addClaim({
        ClaimRef: itemRef,
        ClaimUser: userRef,
        ClaimEvidence: "", // Can be enhanced later
      });

      alert("Item claimed successfully!");
      // Reload claims
      const claims: Claim[] = await getClaimsByItem(itemRef);
      const claimRecords: ClaimRecord[] = await Promise.all(
        claims.map(async (claim) => {
          try {
            const userDoc = await claim.ClaimUser.get();
            if (userDoc.exists()) {
              const userData = userDoc.data();
              return {
                id: claim.id,
                userName: userData.UserName || userData.UserEmail,
                userEmail: userData.UserEmail,
              };
            }
            return { id: claim.id };
          } catch (e) {
            return { id: claim.id };
          }
        })
      );
      setClaimedBy(claimRecords);
    } catch (e) {
      console.error("Claim exception:", e);
      alert("Claim failed: " + String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1">
      <button
        onClick={handleClaim}
        disabled={loading}
        className="bg-green-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-green-700 transition disabled:opacity-60"
      >
        {loading ? "Claiming…" : "Claim this item"}
      </button>
      <div className="mt-2 text-sm text-gray-600">
        {claimedBy.length === 0
          ? "No one has claimed this yet"
          : `Claimed by: ${claimedBy.map((c) => c.userName || c.userEmail).join(", ")}`}
      </div>
    </div>
  );
}
