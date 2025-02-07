import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          const hashedpassword = await bcrypt.hash(credentials.password, 10);

          const isVaildPassword = bcrypt.compare(
            credentials.password,
            hashedpassword
          );

          if (!user || !isVaildPassword) {
            throw new Error("Wrong email or password.");
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user?.image,
          };
        } catch (error) {
          console.error("Login error:", error);
          throw new Error(error?.message || "Invalid credentials.");
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account.provider === "google") {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name,
                image: user.image,
                provider: "google",
              },
            });
          }
        }

        return true;
      } catch (error) {
        console.error("Sign-in error:", error);
        return false;
      }
    },

    async session({ session }) {
      try {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
        });

        if (!dbUser) return null;

        session.user.id = dbUser.id;
        return session;
      } catch (error) {
        console.error("Session error:", error);
        return null;
      }
    },
  },
};
