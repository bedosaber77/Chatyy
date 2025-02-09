import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
export async function UserPhoto() {
  const session = await getServerSession(authOptions);
  return (
    <>
      {session && (
        <Image
          src={session?.user?.image || "/default-avatar.png"}
          alt="User Avatar"
          width={32}
          height={32}
          className="rounded-full mt-2"
        />
      )}
    </>
  );
}
