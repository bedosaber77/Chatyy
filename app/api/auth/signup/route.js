import NextAuth from "next-auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs/dist/bcrypt";
export async function POST(req) {
  const body = await req.json();
  const { email, password, userName } = body;
  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: "Email and password are required" }),
      { status: 400 }
    );
  }

  prisma.user
    .findUnique({
      where: { email },
    })
    .then((user) => {
      if (user) {
        return new Response(JSON.stringify({ error: "User already exists" }), {
          status: 400,
        });
      }
    });
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      name: userName,
      email,
      password: hashedPassword,
    },
  });
  return new Response(
    JSON.stringify({ message: "User created successfully", user: newUser }),
    { status: 201 }
  );
}
