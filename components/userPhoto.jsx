"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";

export function UserPhoto({ img }) {
  const { data: session } = useSession();

  const src = img || session?.user?.image || "/default-avatar.png";

  return (
    <Image
      src={src}
      alt="User Avatar"
      width={32}
      height={32}
      className="rounded-full mt-2"
    />
  );
}
