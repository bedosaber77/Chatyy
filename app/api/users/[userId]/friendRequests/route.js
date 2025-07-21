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
        friendRequests: true, // Include friends relation
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Format the response to include only necessary fields
    const friendRequests = await prisma.user.findMany({
      where: {
        id: { in: user.friendRequests },
      },
      select: {
        id: true,
        name: true,
        image: true,
      },
    });
    return NextResponse.json(
      { friendRequests },
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

export async function POST(req, { params }) {
  try {
    const { userId } = await params;
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const { friendEmail } = await req.json();

    console.log("mail", friendEmail);

    const friend = await prisma.user.findUnique({
      where: { email: friendEmail },
    });

    if (!friend) {
      return NextResponse.json(
        { error: "Friend ID is required" },
        { status: 400 }
      );
    }

    // Add friend request
    const updatedUser = await prisma.user.update({
      where: { id: friend.id },
      data: {
        friendRequests: {
          push: userId,
        },
      },
    });

    return NextResponse.json(
      { message: "Friend request sent successfully", user: updatedUser },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error sending friend request:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
