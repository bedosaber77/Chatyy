import Sidebar from "@/components/sidebar";
import "./globals.css";
import { UserPhoto } from "@/components/userPhoto";
import SessionWrapper from "@/components/SessionWrapper";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
