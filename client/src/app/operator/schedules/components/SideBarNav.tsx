import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Clock, LandPlot, MapPin, MousePointerClick, Route, Search, Timer } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface TabProps {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

const SideBarNav: React.FC<TabProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex justify-center items-center gap-2 mb-4">
      {/* select */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setActiveTab("schedule")}
              className={cn(
                "p-3 grid place-items-center rounded-full border",
                activeTab == "schedule" && "bg-foreground text-background"
              )}
            >
              <Clock className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Create schedule</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setActiveTab("route")}
              className={cn(
                "p-3 grid place-items-center rounded-full border",
                activeTab == "route" && "bg-foreground text-background"
              )}
            >
              <Route className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Search routes</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

    </div>
  );
};

export default SideBarNav;
