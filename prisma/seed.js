import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.chatUser.deleteMany();
  await prisma.message.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create users
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

  const charlie = await prisma.user.create({
    data: {
      name: "Charlie",
      email: "charlie@example.com",
      password: hashedPassword,
      image: "https://randomuser.me/api/portraits/men/2.jpg",
    },
  });

  const diana = await prisma.user.create({
    data: {
      name: "Diana",
      email: "diana@example.com",
      password: hashedPassword,
      image: "https://randomuser.me/api/portraits/women/2.jpg",
    },
  });

  // Set up mutual friendships
  await prisma.user.update({
    where: { id: alice.id },
    data: {
      friends: {
        set: [bob.id, charlie.id], // Alice is friends with Bob and Charlie
      },
    },
  });

  await prisma.user.update({
    where: { id: bob.id },
    data: {
      friends: {
        set: [alice.id], // Bob is friends with Alice
      },
      friendRequests: {
        push: diana.id, // Diana sent Bob a friend request (pending)
      },
    },
  });

  await prisma.user.update({
    where: { id: charlie.id },
    data: {
      friends: {
        set: [alice.id], // Charlie is friends with Alice
      },
      friendRequests: {
        push: diana.id, // Diana sent Charlie a friend request (pending)
      },
    },
  });

  await prisma.user.update({
    where: { id: diana.id },
    data: {
      friendRequests: {
        push: alice.id, // Diana sent Alice a friend request (pending)
      },
    },
  });

  // Create a chat for Alice and Bob to test chat-related relations
  const chat = await prisma.chat.create({
    data: {},
  });

  await prisma.chatUser.createMany({
    data: [
      { chatId: chat.id, userId: alice.id },
      { chatId: chat.id, userId: bob.id },
    ],
  });

  // Create messages in the chat
  await prisma.message.create({
    data: {
      text: "Hello, Bob! This is Alice.",
      chat: { connect: { id: chat.id } },
      user: { connect: { id: alice.id } },
    },
  });

  await prisma.message.create({
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
