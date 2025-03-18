import { auth } from "@/auth";
import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import ProfileForm from "./profile-form";

export const metadata: Metadata = {
  title: "Perfil Usuario",
};

export default async function Profile() {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div className="max-w-md mx-auto space-y-4">
        <h2 className="h2-bold">Perfil</h2>
        <ProfileForm></ProfileForm>
      </div>
    </SessionProvider>
  );
}
