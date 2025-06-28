import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const conversations = await prisma.chatUser.findMany({
      where: { userId },
      include: {
        chat: {
          include: {
            messages: {
              orderBy: { createdAt: "desc" },
              take: 1,
            },
            chatUsers: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    const formattedConversations = conversations.map((chatUser) => {
      const chat = chatUser.chat;
      const participants = chat.chatUsers.map((cu) => cu.user);
      const otherUser = participants.find((u) => u.id !== userId);
      return {
        id: chat.id,
        name: otherUser.name || "NAN",
        lastMessage: chat.messages[0]?.text || "No messages",
      };
    });

    return NextResponse.json(formattedConversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
