import { withAuth } from "next-auth/middleware";

export function middleware(req) {
  return withAuth(req, {
    pages: {
      signIn: "/login",
    },
  });
}

export const config = {
  matcher: ["/"], // Apply middleware to the root route
};
