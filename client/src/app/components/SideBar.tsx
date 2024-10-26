"use client";

import "../globals.css";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Bolt,
  CircleAlert,
  FlagTriangleRight,
  HelpCircle,
  Navigation,
  Sparkle,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

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
      title: "Navigation",
      icon: <Navigation className="h-4 w-4" strokeWidth={2.5} />,
      href: "/",
    },
    {
      title: "Taxi",
      icon: <FlagTriangleRight className="h-4 w-4" strokeWidth={2.5} />,
      href: "/taxi",
    },
    {
      title: "Review",
      icon: <Sparkle className="h-4 w-4" strokeWidth={2.5} />,
      href: "/review",
    },
    {
      title: "Settings",
      icon: <Bolt className="h-4 w-4" strokeWidth={2.5} />, // other icons: Cog, Setting, Settings2
      href: "/review",
    },
  ];

  const showLayoutPaths = ["/", "/taxi", "/review", "/settings"];
  const shouldShowLayout = showLayoutPaths.includes(pathname);

  return shouldShowLayout ? (
    <main className="flex h-screen overflow-hidden bg-background">
      <div className="w-fit h-full fixed top-0 left-0 z-20 flex">
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
                {/* <LogoutButton expandState={[isExpanded, setIsExpanded]} /> */}
              </div>
            </nav>
          </ScrollArea>
        </aside>
        {/* {isExpanded && (
          <div
            className={cn(
              "inline-block w-screen h-screen transition-colors duration-300 pointer-events-none",
              isExpanded && "bg-black/30"
            )}
          ></div>
        )} */}
      </div>
      <div className="w-full h-full ps-16">
        <div
          className={cn(
            "z-10 w-screen h-screen pointer-events-none fixed inset-0 transition-colors duration-300",
            isExpanded && "bg-black/50"
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
