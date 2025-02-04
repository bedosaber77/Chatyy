import "./globals.css";
import Sidebar from "@/components/sidebar";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex ">
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
