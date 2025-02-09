import Sidebar from "@/components/sidebar";
import "./globals.css";
import { UserPhoto } from "@/components/userPhoto";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
