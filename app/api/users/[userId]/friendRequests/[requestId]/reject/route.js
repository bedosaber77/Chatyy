import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req, { params }) {
  try {
    const { userId, requestId } = params;

    if (!userId || !requestId) {
      return NextResponse.json(
        { error: "User ID and Request ID are required" },
        { status: 400 }
      );
    }

    // Reject the friend request
    const prevRequests = await prisma.user.findUnique({
      where: { id: userId },
      select: { friendRequests: true },
    });

    const filteredRequests = prevRequests.friendRequests.filter(
      (id) => id !== requestId
    );
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        friendRequests: {
          set: filteredRequests,
        },
      },
    });

    return NextResponse.json(
      { message: "Friend request rejected successfully", user: updatedUser },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
