import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { LandPlot, MapPin, MousePointerClick, Route, Search } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface TabProps {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

const SideBarNav: React.FC<TabProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex justify-center items-center gap-2 mb-4">
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

      {/* select */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setActiveTab("create")}
              className={cn(
                "p-3 grid place-items-center rounded-full border",
                activeTab == "create" && "bg-foreground text-background"
              )}
            >
              <MousePointerClick className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Create route</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setActiveTab("stop")}
              className={cn(
                "p-3 grid place-items-center rounded-full border",
                activeTab == "stop" && "bg-foreground text-background"
              )}
            >
              <LandPlot className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Search by bus stop</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setActiveTab("place")}
              className={cn(
                "p-3 grid place-items-center rounded-full border",
                activeTab == "place" && "bg-foreground text-background"
              )}
            >
              <MapPin className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Search by place</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default SideBarNav;
