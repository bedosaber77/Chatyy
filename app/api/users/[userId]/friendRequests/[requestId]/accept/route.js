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

    // Accept the friend request
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
        friends: {
          push: requestId,
        },
        friendRequests: {
          set: filteredRequests,
        },
      },
    });

    // Also add the user to the friend's friends list
    await prisma.user.update({
      where: { id: requestId },
      data: {
        friends: {
          push: userId,
        },
      },
    });

    return NextResponse.json(
      { message: "Friend request accepted successfully", user: updatedUser },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error accepting friend request:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
