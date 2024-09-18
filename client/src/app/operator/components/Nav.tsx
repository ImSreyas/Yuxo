"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Nav = () => {
  const pathname = usePathname();

  return (
    <div className="hidden sm:flex items-center justify-between py-4">
      <div className="w-10 aspect-square"></div>
      <div className="flex font-bold">
        <Link
          href="/operator"
          className={`${
            pathname === "/operator" ? "text-foreground" : "text-muted-foreground"
          } hover:text-foreground p-6`}
        >
          Buses
        </Link>
        <Link
          href="/operator/schedules"
          className={`${
            pathname.startsWith("/operator/schedules") ? "text-foreground" : "text-muted-foreground"
          } hover:text-foreground p-6`}
        >
          Schedules
        </Link>
        <Link
          href="/operator/routes"
          className={`${
            pathname.startsWith("/operator/routes") ? "text-foreground" : "text-muted-foreground"
          } hover:text-foreground p-6`}
        >
          Routes
        </Link>
        <Link
          href="/operator/stops"
          className={`${
            pathname.startsWith("/operator/stops") ? "text-foreground" : "text-muted-foreground"
          } hover:text-foreground p-6`}
        >
          Stops
        </Link>
      </div>
      <div className="bg-zinc-300 w-10 aspect-square rounded-full"></div>
    </div>
  );
};

export default Nav;
