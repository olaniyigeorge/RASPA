export type UserRole = "USER" | "CONTRACTOR" | "ADMIN";

export interface User {
  id: string;
  firebaseUid: string;
  email: string;
  name: string | null;
  image: string | null;
  phone: string | null;
  role: UserRole;
}

/** What the identity provider (Firebase) asserts about a person. */
export interface VerifiedIdentity {
  uid: string;
  email: string;
  emailVerified: boolean;
  name?: string;
  picture?: string;
}

export const isAdmin = (u: Pick<User, "role">) => u.role === "ADMIN";

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByFirebaseUid(uid: string): Promise<User | null>;
  upsertFromIdentity(identity: VerifiedIdentity): Promise<User>;
  setRole(userId: string, role: UserRole): Promise<void>;
}

export interface IdentityProvider {
  verifyIdToken(idToken: string): Promise<VerifiedIdentity>;
  createSessionCookie(idToken: string, expiresInMs: number): Promise<string>;
  verifySessionCookie(cookie: string): Promise<VerifiedIdentity>;
}
