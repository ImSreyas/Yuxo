"use client";

import "../../globals.css";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Bolt,
  BusFront,
  CircleAlert,
  HelpCircle,
  Hourglass,
  MapPinned,
  Waypoints,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import LogoutButton from "./LogoutButton";

const SideBar = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  const handleLogout = () => {};

  const navItems: any = [
    {
      title: "Buses",
      icon: <BusFront className="h-4 w-4" strokeWidth={2.5} />,
      href: "/operator",
    },
    {
      title: "Schedules",
      icon: <Hourglass className="h-4 w-4" strokeWidth={2.5} />,
      href: "/operator/schedules",
    },
    {
      title: "Routes",
      icon: <Waypoints className="h-4 w-4" strokeWidth={2.5} />,
      href: "/operator/routes",
    },
    {
      title: "Bus stops",
      icon: <MapPinned className="h-4 w-4" strokeWidth={2.5} />, // other icons: Cog, Setting, Settings2
      href: "/operator/stops",
    },
    {
      title: "Settings",
      icon: <Bolt className="h-4 w-4" strokeWidth={2.5} />, // other icons: Cog, Setting, Settings2
      href: "/operator/settings",
    },
  ];

  const showLayoutPaths = [
    "/operator",
    "/operator/buses",
    "/operator/schedules",
    "/operator/routes",
    "/operator/stops",
    "/operator/settings",
  ];
  const shouldShowLayout = showLayoutPaths.includes(pathname);

  return shouldShowLayout ? (
    <main className="flex min-h-screen overflow-hidden bg-background">
      <div className="w-fit h-full fixed top-0 left-0 z-50 flex">
        <aside
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          className={cn(
            "border-r bg-background transition-all duration-300 ease-in-out inline-block",
            isExpanded ? "w-64" : "w-16"
          )}
        >
          <div className="flex h-16 items-center justify-center border-b">
            <span className={cn("text-xl font-bold block")}>
              <Zap className="w-6 h-6" />
            </span>
            {/* <span
              className={cn(
                "w-0 text-xl font-bold block transition-all opacity-0 duration-300",
                isExpanded && "opacity-100"
              )}
            >
              Yuxo
            </span> */}
          </div>
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <nav className="p-2 h-full flex flex-col justify-between">
              <div>
                {navItems.map((item: any) => (
                  <Link key={item.href} href={item.href} passHref>
                    <Button
                      variant="ghost"
                      className={cn("w-60 justify-start px-2 mb-1")}
                    >
                      <span
                        className={cn(
                          "p-2",
                          pathname == item.href &&
                            "text-background bg-foreground rounded-xl"
                        )}
                      >
                        {item.icon}
                      </span>
                      <span
                        className={cn(
                          "ml-3 transition-opacity duration-300 font-semibold",
                          isExpanded
                            ? "opacity-100 block"
                            : "opacity-0 relative"
                        )}
                      >
                        {item.title}
                      </span>
                    </Button>
                  </Link>
                ))}
              </div>
              <div className="mb-2">
                <Link href="/help" passHref>
                  <Button
                    variant="ghost"
                    className="w-60 justify-start px-2 mb-1"
                  >
                    <span
                      className={cn(
                        "p-2",
                        pathname == "/help" &&
                          "text-background bg-foreground rounded-lg"
                      )}
                    >
                      <HelpCircle className="h-4 w-4" strokeWidth={2.5} />
                    </span>
                    <span
                      className={cn(
                        "ml-4 transition-opacity duration-300",
                        isExpanded ? "opacity-100" : "opacity-0"
                      )}
                    >
                      Help
                    </span>
                  </Button>
                </Link>
                <Link href="/report" passHref>
                  <Button
                    variant="ghost"
                    className="w-60 justify-start px-2 mb-1"
                  >
                    <span
                      className={cn(
                        "p-2",
                        pathname == "/report" &&
                          "text-background bg-foreground rounded-lg"
                      )}
                    >
                      <CircleAlert className="h-4 w-4" strokeWidth={2.5} />
                    </span>
                    <span
                      className={cn(
                        "ml-4 transition-opacity duration-300",
                        isExpanded ? "opacity-100" : "opacity-0"
                      )}
                    >
                      Report
                    </span>
                  </Button>
                </Link>
                <LogoutButton expandState={[isExpanded, setIsExpanded]} />
              </div>
            </nav>
          </ScrollArea>
        </aside>
      </div>
      <div className="w-full h-full ps-16">
        <div
          className={cn(
            "z-40 w-screen h-screen pointer-events-none fixed inset-0 transition-colors duration-300",
            isExpanded && "bg-black/75"
          )}
        ></div>
        {children}
      </div>
    </main>
  ) : (
    <>{children}</>
  );
};

export default SideBar;
