import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  if (!query || query.length < 3) {
    return NextResponse.json({ friends: [] });
  }

  try {
    // Search for users by email or name
    const friends = await prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: query, mode: "insensitive" } },
          { name: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    return NextResponse.json({ friends });
  } catch (error) {
    console.error("Error searching friends:", error);
    return NextResponse.json({ friends: [] }, { status: 500 });
  }
}
