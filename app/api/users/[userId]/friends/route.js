import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const { userId } = await params;
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        friends: true, // Include friends relation
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Format the response to include only necessary fields
    const friends = await prisma.user.findMany({
      where: {
        id: { in: user.friends },
      },
      select: {
        id: true,
        name: true,
        image: true,
      },
    });
    return NextResponse.json(
      { friends },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching friends:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
