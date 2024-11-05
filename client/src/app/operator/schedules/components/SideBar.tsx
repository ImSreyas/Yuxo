import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { X, Search, MapPin, LandPlot, Check, Cross } from "lucide-react";
import ToolBar from "./ToolBar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GeocodeFeature } from "@mapbox/mapbox-sdk/services/geocoding";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import SideBarNav from "./SideBarNav";
import RouteToolBar from "./RouteToolBar";
import supabase from "@/utils/supabase/client";
import { Close } from "@radix-ui/react-toast";
import { MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarProps {
  sideBarActive: boolean;
  query: string;
  setQuery: (value: string) => void;
  handleSearchClose: () => void;
  selectedStops: any[];
  setSelectedStops: Dispatch<SetStateAction<any[]>>;
  routes: any[];
  setSelectedRoute: Dispatch<SetStateAction<any>>;
  setRouteId: Dispatch<SetStateAction<number | null>>;
}

const Sidebar: React.FC<SidebarProps> = ({
  sideBarActive,
  query,
  setQuery,
  handleSearchClose,
  selectedStops,
  setSelectedStops,
  routes,
  setSelectedRoute,
  setRouteId,
}) => {
  const [activeTab, setActiveTab] = useState<string>("route");
  const [subActiveTab, setSubActiveTab] = useState<string>("all");
  const [busStops, setBusStops] = useState<any>(null);

  const handleSelect = (stop: any) => {
    setSelectedStops((state: any) => [...state, stop]);
  };
  // console.log(selectedStops);
  const fetchBusStops = async () => {
    const { data, error } = await supabase.from("tbl_bus_stops").select("*");

    if (error) {
      console.error("Error fetching stops:", error);
      return null;
    }

    if (!data) {
      console.error("No data found");
      return null;
    }
    setBusStops(data);
    // console.log(data);
  };

  useEffect(() => {
    fetchBusStops();
  }, []);

  return (
    <div
      className={cn(
        "absolute w-100 top-0 left-0 z-10 px-5 py-6 bg-white h-full block transition-all duration-400 border-right border-r",
        sideBarActive ? "" : "-left-100"
      )}
    >
      <Tabs
        className="absolute inset-0 px-5 py-6"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        {/* top toolbar */}
        <SideBarNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Add schedule */}
        <TabsContent value="schedule">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for schedules"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="ps-5 pe-12 bg-background rounded-full"
            />
            <button className="flex justify-center items-center absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-2 w-fit h-fit bg-foreground">
              {query ? (
                <X
                  className="h-3 w-3 text-background"
                  strokeWidth={2.5}
                  onClick={handleSearchClose}
                />
              ) : (
                <Search className="h-3 w-3 text-background" strokeWidth={2.5} />
              )}
            </button>
          </div>
          <RouteToolBar />

          <Tabs
            className=""
            value={subActiveTab}
            onValueChange={setSubActiveTab}
          >
            {/* top toolbar */}
            <div className="flex justify-start border-t pt-4 items-center gap-2 mt-1">
              <button
                onClick={() => setSubActiveTab("all")}
                className={cn(
                  "px-4 py-2 grid place-items-center rounded-full border text-sm",
                  // subActiveTab == "all" && "bg-foreground text-background"
                  subActiveTab == "all" && "border-zinc-400"
                )}
              >
                <div>All</div>
              </button>

              {/* select */}
              <button
                onClick={() => setSubActiveTab("select")}
                className={cn(
                  "px-4 py-2 flex rounded-full border text-sm justify-center items-center gap-2",
                  // subActiveTab == "select" && "bg-foreground text-background"
                  subActiveTab == "select" && "border-zinc-400"
                )}
              >
                <div>Selected</div>
                {selectedStops.length != 0 && (
                  <div className="h-5 text-xs rounded-full aspect-square bg-foreground text-background grid place-items-center">
                    {selectedStops.length}
                  </div>
                )}
              </button>
            </div>

            <TabsContent value="all">
              <div className="mt-2 h-108 overflow-y-scroll no-scrollbar">
                {busStops?.map(
                  (stop: any) =>
                    !selectedStops.includes(stop) && (
                      <button
                        key={stop.stop_id}
                        className="w-full flex justify-between items-center py-3 px-1 text-sm border-b"
                      >
                        <div>{stop.stop_name}</div>
                        <div className="flex items-center gap-2">
                          <div className="text-zinc-500 text-xs">
                            {stop.stop_type}
                          </div>
                          <button
                            className="bg-foreground text-background p-1 rounded-lg"
                            onClick={() => {
                              handleSelect(stop);
                            }}
                          >
                            <Check className="h-3 w-3" />
                          </button>
                        </div>
                      </button>
                    )
                )}
              </div>
            </TabsContent>

            <TabsContent value="select">
              <div className="mt-2 h-108 overflow-y-scroll no-scrollbar">
                {selectedStops?.map((stop: any, index: number) => (
                  <button
                    key={stop.stop_id}
                    className="w-full flex justify-between items-center py-3 px-1 text-sm border-b"
                  >
                    <div>{stop.stop_name}</div>
                    <div className="flex items-center gap-2">
                      <div className="text-zinc-500 text-xs">
                        {stop.stop_type}
                      </div>
                      <button
                        className="bg-foreground text-background p-1 rounded-lg"
                        onClick={() => {
                          setSelectedStops((stops: any) =>
                            stops.filter((_: any, i: number) => i !== index)
                          );
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* route */}
        <TabsContent value="route">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for a route"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="ps-5 pe-12 bg-background rounded-full"
            />
            <button className="flex justify-center items-center absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-2 w-fit h-fit bg-foreground">
              {query ? (
                <X
                  className="h-3 w-3 text-background"
                  strokeWidth={2.5}
                  onClick={handleSearchClose}
                />
              ) : (
                <Search className="h-3 w-3 text-background" strokeWidth={2.5} />
              )}
            </button>
          </div>
          <ToolBar />
          <div className="mt-2 h-120 overflow-y-scroll no-scrollbar">
            {routes.map((route: any) => (
              <button
                key={route.id}
                onClick={() => {
                  setSelectedRoute(route);
                  setRouteId(route.route_id);
                }}
                className="flex justify-between items-center w-full py-2 border-b text-sm"
              >
                <div>{route.route_name}</div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      // onClick={}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </button>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sidebar;
