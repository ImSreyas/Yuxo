"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users,
  UserCog,
  Bus,
  MapPin,
  Route,
  Calendar,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

interface NavItem {
  title: string;
  icon: React.ReactNode;
  href: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      title: "Users",
      icon: <Users className="h-4 w-4" strokeWidth={2.5} />,
      href: "/admin",
    },
    {
      title: "Operators",
      icon: <UserCog className="h-4 w-4" strokeWidth={2.5} />,
      href: "/admin/operators",
    },
    { title: "Buses", icon: <Bus className="h-4 w-4" />, href: "/admin/buses" },
    {
      title: "Bus Stops",
      icon: <MapPin className="h-4 w-4" strokeWidth={2.5}/>,
      href: "/admin/stops",
    },
    {
      title: "Routes",
      icon: <Route className="h-4 w-4" strokeWidth={2.5}/>,
      href: "/admin/routes",
    },
    {
      title: "Schedules",
      icon: <Calendar className="h-4 w-4" strokeWidth={2.5}/>,
      href: "/admin/schedules",
    },
    {
      title: "Analytics",
      icon: <BarChart3 className="h-4 w-4" strokeWidth={2.5}/>,
      href: "/admin/analytics",
    },
    {
      title: "Settings",
      icon: <Settings className="h-4 w-4" strokeWidth={2.5}/>,
      href: "/admin/settings",
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={cn(
          "border-r bg-background transition-all duration-300 ease-in-out relative",
          isExpanded ? "w-64" : "w-16"
        )}
      >
        <div className="flex h-16 items-center justify-center border-b">
          <span
            className={cn("text-xl font-bold", isExpanded ? "block" : "hidden")}
          >
            Admin
          </span>
          <span
            className={cn("text-xl font-bold", isExpanded ? "hidden" : "block")}
          >
            A
          </span>
        </div>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <nav className="space-y-1 p-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} passHref>
                <Button
                  variant="ghost"
                  className={cn("w-60 justify-start px-2 mb-1")}
                >
                  <span
                    className={cn(
                      "p-2",
                      pathname == item.href &&
                        "text-background bg-foreground rounded-lg"
                    )}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={cn(
                      "ml-3 transition-opacity duration-300 font-semibold",
                      isExpanded ? "opacity-100 block" : "opacity-0 relative"
                    )}
                  >
                    {item.title}
                  </span>
                </Button>
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="absolute bottom-4 left-0 right-0 p-2">
          <Link href="/admin/help" passHref>
            <Button variant="ghost" className="w-60 justify-start px-2">
              <span
                className={cn(
                  "p-2",
                  pathname == "/admin/help" &&
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
          <Link href="/logout" passHref>
            <Button
              variant="ghost"
              className="w-60 justify-start text-destructive hover:text-destructive"
            >
              <LogOut className="h-4 w-4" strokeWidth={2.5} />
              <span
                className={cn(
                  "ml-4 transition-opacity duration-300",
                  isExpanded ? "opacity-100" : "opacity-0"
                )}
              >
                Logout
              </span>
            </Button>
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto px-12 py-6">{children}</main>
    </div>
  );
}
