"use client";

import useAuth from "@/app/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LogoutButton = ({ expandState }: { expandState: [boolean, any] }) => {
  const [isExpanded, setIsExpanded] = expandState;
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  useEffect(() => {
    if (isExpanded) {
      setIsExpanded(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-60 justify-start text-destructive hover:text-destructive -z-50"
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
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Logout</DialogTitle>
          <DialogDescription>
            Are you sure you want to Logout?
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-2 pt-4">
          <Button
            variant="secondary"
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutButton;
