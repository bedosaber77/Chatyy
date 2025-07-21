import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import next from "next";

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

    // Step 1: Get user's chat IDs (fast query)
    const userChats = await prisma.chatUser.findMany({
      where: { userId },
      select: { chatId: true },
    });

    if (userChats.length === 0) {
      return NextResponse.json([]);
    }

    const chatIds = userChats.map((uc) => uc.chatId);

    // Step 2: Get other users in these chats (fast query)
    const otherChatUsers = await prisma.chatUser.findMany({
      where: {
        chatId: { in: chatIds },
        userId: { not: userId },
      },
      select: {
        chatId: true,
        userId: true,
      },
    });

    // Step 3: Get user details (fast query)
    const userIds = [...new Set(otherChatUsers.map((cu) => cu.userId))];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        name: true,
        image: true,
      },
    });

    // Step 4: Get latest messages (fast query with proper index)
    const latestMessages = await prisma.message.findMany({
      where: { chatId: { in: chatIds } },
      orderBy: { createdAt: "desc" },
      distinct: ["chatId"],
      select: {
        chatId: true,
        text: true,
      },
    });

    // Step 5: Build result (in-memory operations)
    const userMap = new Map(users.map((u) => [u.id, u]));
    const messageMap = new Map(latestMessages.map((m) => [m.chatId, m.text]));
    const chatUserMap = new Map();

    otherChatUsers.forEach((cu) => {
      chatUserMap.set(cu.chatId, cu.userId);
    });

    const formattedConversations = chatIds.map((chatId) => {
      const otherUserId = chatUserMap.get(chatId);
      const otherUser = userMap.get(otherUserId);

      return {
        id: chatId,
        name: otherUser?.name || "Unknown User",
        image: otherUser?.image || "/default-avatar.png",
        lastMessage: messageMap.get(chatId) || "No messages",
      };
    });

    return NextResponse.json(formattedConversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const friendId = searchParams.get("friendId");

  try {
    // Find all chatUser records for either user
    const chatLinks = await prisma.chatUser.findMany({
      where: {
        userId: { in: [userId, friendId] },
      },
      select: {
        chatId: true,
        userId: true,
      },
    });

    // Group chatIds by user
    const chatMap = new Map();
    for (const { chatId, userId } of chatLinks) {
      if (!chatMap.has(userId)) {
        chatMap.set(userId, new Set());
      }
      chatMap.get(userId).add(chatId);
    }

    // Find a shared chatId between both users
    const sharedChatId = [...(chatMap.get(userId) || [])].find((id) =>
      chatMap.get(friendId)?.has(id)
    );

    if (sharedChatId) {
      return NextResponse.json({ chatId: sharedChatId });
    }

    // Create new chat with both users
    const newChat = await prisma.chat.create({
      data: {
        chatUsers: {
          create: [{ userId }, { userId: friendId }],
        },
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json({ chatId: newChat.id });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
