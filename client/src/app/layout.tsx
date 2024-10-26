import type { Metadata } from "next";
import "./globals.css";
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
    <html lang="en">
      <body className="">
        <Toaster className="pointer-events-auto" />
        <SideBar>{children}</SideBar>
      </body>
    </html>
  );
}
