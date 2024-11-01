import type { Metadata } from "next";
import { Toaster } from "sonner";
import SideBar from "./components/SideBar";

export const metadata: Metadata = {
  title: "Yuxo",
  description: "Bus public transportation navigator for passengers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {/* <Toaster className="pointer-events-auto" /> */}
      <SideBar>{children}</SideBar>
    </div>
  );
}
