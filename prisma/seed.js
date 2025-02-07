import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const hashedPassword = await bcrypt.hash("password123", 10);

  const user1 = await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@example.com",
      password: hashedPassword,
      image: "https://randomuser.me/api/portraits/women/1.jpg",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Bob",
      email: "bob@example.com",
      password: hashedPassword,
      image: "https://randomuser.me/api/portraits/men/1.jpg",
    },
  });

  const conversation = await prisma.conversation.create({
    data: {},
  });

  await prisma.userConversations.createMany({
    data: [
      {
        userId: user1.id,
        conversationId: conversation.id,
      },
      {
        userId: user2.id,
        conversationId: conversation.id,
      },
    ],
  });
  await prisma.message.createMany({
    data: [
      {
        text: "Hey Bob, how are you?",
        senderId: user1.id,
        conversationId: conversation.id,
        createdAt: new Date(),
      },
      {
        text: "Hey Alice! I'm good, how about you?",
        senderId: user2.id,
        conversationId: conversation.id,
        createdAt: new Date(),
      },
    ],
  });

  console.log("✅ Database seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
