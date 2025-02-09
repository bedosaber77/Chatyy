import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.chatUser.deleteMany();
  await prisma.message.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 10);

  const alice = await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@example.com",
      password: hashedPassword,
      image: "https://randomuser.me/api/portraits/women/1.jpg",
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: "Bob",
      email: "bob@example.com",
      password: hashedPassword,
      image: "https://randomuser.me/api/portraits/men/1.jpg",
    },
  });

  const chat = await prisma.chat.create({
    data: {},
  });

  // Create join records (ChatUser) to connect users with the chat
  await prisma.chatUser.createMany({
    data: [
      { chatId: chat.id, userId: alice.id },
      { chatId: chat.id, userId: bob.id },
    ],
  });

  // Create some Messages in the chat
  const message1 = await prisma.message.create({
    data: {
      text: "Hello, this is Alice!",
      chat: { connect: { id: chat.id } },
      user: { connect: { id: alice.id } },
    },
  });

  const message2 = await prisma.message.create({
    data: {
      text: "Hi, Alice! This is Bob.",
      chat: { connect: { id: chat.id } },
      user: { connect: { id: bob.id } },
    },
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
