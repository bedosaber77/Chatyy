import Sidebar from "@/components/sidebar";
import "../globals.css";
import { UserPhoto } from "@/components/userPhoto";

export default function Layout({ children }) {
  return (
    <div className="flex">
      <Sidebar>
        <UserPhoto />
      </Sidebar>
      <main className="flex-grow">{children}</main>
    </div>
  );
}
