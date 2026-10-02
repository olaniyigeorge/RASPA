import { getCurrentUser } from "@/modules/identity";
import { SiteHeaderClient } from "./site-header-client";

export async function SiteHeader() {
  const user = await getCurrentUser();
  return (
    <SiteHeaderClient
      user={user ? { name: user.name, image: user.image, email: user.email, role: user.role } : null}
    />
  );
}
