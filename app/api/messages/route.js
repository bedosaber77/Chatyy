import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chatId");

    if (!chatId) {
      return NextResponse.json(
        { error: "chatId is required" },
        { status: 400 }
      );
    }

    const messages = await prisma.message.findMany({
      where: { chatId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc", // oldest to newest
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { chatId, userId, text } = body;

    if (!chatId || !userId || !text) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newMessage = await prisma.message.create({
      data: {
        chatId,
        userId,
        text,
      },
    });

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
