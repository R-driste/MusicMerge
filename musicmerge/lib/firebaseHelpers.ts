// Helper functions for Firebase Firestore operations using the new nested structure
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  GeoPoint,
  type DocumentReference,
} from "firebase/firestore";
import { firebaseDb } from "./firebaseClient";

//type definitions matching the new structure
export type UserRole = "superadmin" | "admin" | "regular"; //superadmin = org owner, can approve admins; admin = can approve students
export type ApplicationStatus = "pending" | "approved" | "denied";
export type OrgApprovalStatus = "pending" | "approved" | "denied";

export interface Organization {
  id: string;
  name?: string;
  Address?: string;
  LocPoint?: GeoPoint;
  AppliedAt?: any; // Firestore Timestamp
  createdAt?: any;
  OrgApprovalStatus?: OrgApprovalStatus; // pending until superadmin approves
}

export interface Location {
  id: string;
  LocName: string;
  LocDesc?: string;
  LocPoint: GeoPoint;
}

export interface Item {
  id: string;
  ItemName: string;
  ItemDesc?: string;
  ItemLoc: DocumentReference; // Reference to Locations/LOC_REF_ID
  ItemImg?: string; // URL
  ItemTime: any; // Timestamp
  HideQuestion?: string;
  HideAnswer?: string;
}

export interface Claim {
  id: string;
  ClaimRef: DocumentReference; // Reference to Items/ITEM_REF_ID
  ClaimEvidence?: string;
  ClaimAnswer?: string;
  ClaimUser: DocumentReference; // Reference to Users/USER_REF_ID
}

export interface Request {
  id: string;
  ItemName: string;
  ItemDesc?: string;
}

export interface Member {
  id: string;
  UserRef: DocumentReference; // Reference to Users/USER_REF_ID
  UserRole: UserRole;
  ApplicationStatus: ApplicationStatus;
}

export interface User {
  id: string;
  UserName?: string;
  UserEmail: string;
}

export interface Application {
  id: string;
  AppOrg: DocumentReference; // Reference to Organizations/ORG_REF_ID
  AppMember: DocumentReference; // Reference to Organizations/ORG_REF_ID/Members/MEMBER_REF_ID
}

// Helper functions for Organizations
export const getOrganization = async (orgId: string) => {
  const orgDoc = await getDoc(doc(firebaseDb, "Organizations", orgId));
  if (!orgDoc.exists()) return null;
  return { id: orgDoc.id, ...orgDoc.data() } as Organization;
};

/** Returns only approved organizations (for public listing e.g. Find your organization). */
export const getAllOrganizations = async (): Promise<Organization[]> => {
  const orgsSnap = await getDocs(collection(firebaseDb, "Organizations"));
  return orgsSnap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Organization))
    .filter((org) => org.OrgApprovalStatus === "approved" || org.OrgApprovalStatus == null);
};

/** For superadmin: list organizations pending approval. */
export const getPendingOrganizations = async (): Promise<Organization[]> => {
  const orgsSnap = await getDocs(
    query(
      collection(firebaseDb, "Organizations"),
      where("OrgApprovalStatus", "==", "pending")
    )
  );
  return orgsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Organization));
};

export const updateOrganization = async (
  orgId: string,
  updates: Partial<Organization>
) => {
  return await updateDoc(doc(firebaseDb, "Organizations", orgId), updates);
};

/** Check if the user is an app-level superadmin (can approve org applications). */
export const isSuperAdmin = async (userId: string): Promise<boolean> => {
  const docSnap = await getDoc(doc(firebaseDb, "AppAdmins", userId));
  return docSnap.exists();
};

// Helper functions for Locations (subcollection of Organizations)
export const getLocations = async (orgId: string): Promise<Location[]> => {
  const locationsSnap = await getDocs(
    collection(firebaseDb, "Organizations", orgId, "Locations")
  );
  return locationsSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Location[];
};

export const addLocation = async (
  orgId: string,
  locationData: Omit<Location, "id">
) => {
  return await addDoc(
    collection(firebaseDb, "Organizations", orgId, "Locations"),
    {
      ...locationData,
      createdAt: serverTimestamp(),
    }
  );
};

export const updateLocation = async (
  orgId: string,
  locationId: string,
  updates: Partial<Location>
) => {
  return await updateDoc(
    doc(firebaseDb, "Organizations", orgId, "Locations", locationId),
    updates
  );
};

export const deleteLocation = async (orgId: string, locationId: string) => {
  return await deleteDoc(
    doc(firebaseDb, "Organizations", orgId, "Locations", locationId)
  );
};

// Helper functions for Items (subcollection of Organizations)
export const getItems = async (orgId: string): Promise<Item[]> => {
  const itemsSnap = await getDocs(
    collection(firebaseDb, "Organizations", orgId, "Items")
  );
  return itemsSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Item[];
};

export const getItem = async (orgId: string, itemId: string) => {
  const itemDoc = await getDoc(
    doc(firebaseDb, "Organizations", orgId, "Items", itemId)
  );
  if (!itemDoc.exists()) return null;
  return { id: itemDoc.id, ...itemDoc.data() } as Item;
};

export const addItem = async (
  orgId: string,
  itemData: Omit<Item, "id">
) => {
  return await addDoc(
    collection(firebaseDb, "Organizations", orgId, "Items"),
    {
      ...itemData,
      ItemTime: serverTimestamp(),
    }
  );
};

export const updateItem = async (
  orgId: string,
  itemId: string,
  updates: Partial<Item>
) => {
  return await updateDoc(
    doc(firebaseDb, "Organizations", orgId, "Items", itemId),
    updates
  );
};

export const deleteItem = async (orgId: string, itemId: string) => {
  return await deleteDoc(
    doc(firebaseDb, "Organizations", orgId, "Items", itemId)
  );
};

// Helper functions for Members (subcollection of Organizations)
export const getMembers = async (orgId: string): Promise<Member[]> => {
  const membersSnap = await getDocs(
    collection(firebaseDb, "Organizations", orgId, "Members")
  );
  return membersSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Member[];
};

export const getMemberByUser = async (
  orgId: string,
  userId: string
): Promise<Member | null> => {
  const userRef = doc(firebaseDb, "Users", userId);
  const membersSnap = await getDocs(
    query(
      collection(firebaseDb, "Organizations", orgId, "Members"),
      where("UserRef", "==", userRef)
    )
  );
  if (membersSnap.empty) return null;
  const memberDoc = membersSnap.docs[0];
  return { id: memberDoc.id, ...memberDoc.data() } as Member;
};

/** Add or set a member. Use userId as document ID so security rules can identify org admins. */
export const addMember = async (
  orgId: string,
  userId: string,
  memberData: Pick<Member, "UserRole" | "ApplicationStatus">
) => {
  return await setDoc(
    doc(firebaseDb, "Organizations", orgId, "Members", userId),
    {
      UserRef: doc(firebaseDb, "Users", userId),
      UserRole: memberData.UserRole,
      ApplicationStatus: memberData.ApplicationStatus,
      createdAt: serverTimestamp(),
    }
  );
};

export const updateMember = async (
  orgId: string,
  memberId: string,
  updates: Partial<Member>
) => {
  return await updateDoc(
    doc(firebaseDb, "Organizations", orgId, "Members", memberId),
    updates
  );
};

// Helper functions for Requests (subcollection of Organizations)
export const getRequests = async (orgId: string): Promise<Request[]> => {
  const requestsSnap = await getDocs(
    collection(firebaseDb, "Organizations", orgId, "Requests")
  );
  return requestsSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Request[];
};

export const addRequest = async (
  orgId: string,
  requestData: Omit<Request, "id">
) => {
  return await addDoc(
    collection(firebaseDb, "Organizations", orgId, "Requests"),
    {
      ...requestData,
      createdAt: serverTimestamp(),
    }
  );
};

// Helper functions for Users
export const getUser = async (userId: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(firebaseDb, "Users", userId));
  if (!userDoc.exists()) return null;
  return { id: userDoc.id, ...userDoc.data() } as User;
};

export const createOrUpdateUser = async (
  userId: string,
  userData: Partial<User>
) => {
  const userRef = doc(firebaseDb, "Users", userId);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    return await updateDoc(userRef, userData);
  } else {
    return await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
    });
  }
};

// Helper functions for Claims (top-level collection)
export const getClaims = async (): Promise<Claim[]> => {
  const claimsSnap = await getDocs(collection(firebaseDb, "Claims"));
  return claimsSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Claim[];
};

export const getClaimsByItem = async (
  itemRef: DocumentReference
): Promise<Claim[]> => {
  const claimsSnap = await getDocs(
    query(
      collection(firebaseDb, "Claims"),
      where("ClaimRef", "==", itemRef)
    )
  );
  return claimsSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Claim[];
};

export const getClaimsByUser = async (
  userRef: DocumentReference
): Promise<Claim[]> => {
  const claimsSnap = await getDocs(
    query(collection(firebaseDb, "Claims"), where("ClaimUser", "==", userRef))
  );
  return claimsSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Claim[];
};

export const addClaim = async (claimData: Omit<Claim, "id">) => {
  return await addDoc(collection(firebaseDb, "Claims"), {
    ...claimData,
    createdAt: serverTimestamp(),
  });
};

export const updateClaim = async (
  claimId: string,
  updates: Partial<Claim>
) => {
  return await updateDoc(doc(firebaseDb, "Claims", claimId), updates);
};

// Helper functions for Applications (subcollection of Users)
export const getUserApplications = async (
  userId: string
): Promise<Application[]> => {
  const appsSnap = await getDocs(
    collection(firebaseDb, "Users", userId, "MyApplications")
  );
  return appsSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Application[];
};

export const addApplication = async (
  userId: string,
  appData: Omit<Application, "id">
) => {
  return await addDoc(
    collection(firebaseDb, "Users", userId, "MyApplications"),
    {
      ...appData,
      createdAt: serverTimestamp(),
    }
  );
};

// Helper to get user's organizations
export const getUserOrganizations = async (
  userId: string
): Promise<{ orgId: string; member: Member }[]> => {
  const userRef = doc(firebaseDb, "Users", userId);
  const orgsSnap = await getDocs(collection(firebaseDb, "Organizations"));
  const results: { orgId: string; member: Member }[] = [];

  for (const orgDoc of orgsSnap.docs) {
    const membersSnap = await getDocs(
      query(
        collection(firebaseDb, "Organizations", orgDoc.id, "Members"),
        where("UserRef", "==", userRef)
      )
    );
    if (!membersSnap.empty) {
      const memberDoc = membersSnap.docs[0];
      results.push({
        orgId: orgDoc.id,
        member: { id: memberDoc.id, ...memberDoc.data() } as Member,
      });
    }
  }

  return results;
};
