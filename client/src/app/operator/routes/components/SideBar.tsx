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

interface SidebarProps {
  sideBarActive: boolean;
  query: string;
  setQuery: (value: string) => void;
  handleSearchClose: () => void;
  suggestions: GeocodeFeature[];
  currentSelectedPlace: string | undefined;
  handleSelectSuggestion: (place: GeocodeFeature) => void;
  distances: Record<string, number | null>;
  selectedStops: any[];
  setSelectedStops: Dispatch<SetStateAction<any[]>>;
}

const Sidebar: React.FC<SidebarProps> = ({
  sideBarActive,
  query,
  setQuery,
  handleSearchClose,
  suggestions,
  currentSelectedPlace,
  handleSelectSuggestion,
  distances,
  selectedStops,
  setSelectedStops,
}) => {
  const [activeTab, setActiveTab] = useState<string>("route");
  const [subActiveTab, setSubActiveTab] = useState<string>("all");
  const [busStops, setBusStops] = useState<any>(null);

  const handleSelect = (stop: any) => {
    setSelectedStops((state: any) => [...state, stop]);
  };
  console.log(selectedStops);
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
    console.log(data);
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
        </TabsContent>

        {/* create route */}
        <TabsContent value="create">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for a bus stop"
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
                  subActiveTab == "all" && "bg-foreground text-background"
                )}
              >
                <div>All</div>
              </button>

              {/* select */}
              <button
                onClick={() => setSubActiveTab("select")}
                className={cn(
                  "px-4 py-2 flex rounded-full border text-sm justify-center items-center gap-2",
                  subActiveTab == "select" && "bg-foreground text-background"
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

            {/* route */}
            <TabsContent value="all">
              <div className="mt-2 h-108 overflow-y-scroll no-scrollbar">
                {busStops?.map(
                  (stop: any) =>
                    !selectedStops.includes(stop) && (
                      <button
                        key={stop.stop_id}
                        className="w-full flex justify-between items-center py-2 px-1 text-sm border-b"
                      >
                        <div>{stop.stop_name}</div>
                        <div className="flex items-center gap-2">
                          <div className="text-zinc-500 text-xs">
                            {stop.stop_type}
                          </div>
                          <button
                            className="bg-foreground text-background p-2 rounded-xl"
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
                    className="w-full flex justify-between items-center py-2 px-1 text-sm border-b"
                  >
                    <div>{stop.stop_name}</div>
                    <div className="flex items-center gap-2">
                      <div className="text-zinc-500 text-xs">
                        {stop.stop_type}
                      </div>
                      <button
                        className="bg-foreground text-background p-2 rounded-xl"
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

        {/* Tab : search for bus stops  */}
        <TabsContent value="stop">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for bus stop"
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
          <div className="h-[76%] max-h-[90%] mt-2 overflow-y-scroll no-scrollbar">
            {suggestions.length > 0 ? (
              suggestions.map((place) => (
                <div
                  key={place.id}
                  className="p-2 py-4 flex gap-5 items-center w-full cursor-pointer"
                  onClick={() => handleSelectSuggestion(place)}
                >
                  <MapPin
                    className={cn(
                      "text-zinc-500 min-w-4 min-h-4 w-4 h-4",
                      currentSelectedPlace === place.id && "text-foreground"
                    )}
                    strokeWidth={currentSelectedPlace === place.id ? 3 : 2}
                  />
                  <TooltipProvider>
                    <Tooltip delayDuration={1000}>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "break-all line-clamp-1 text-sm",
                            currentSelectedPlace === place.id && ""
                          )}
                        >
                          {place.place_name}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs max-w-96">
                          {place.place_name}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {distances?.[place.id] !== undefined &&
                    distances[place.id] !== null && (
                      <div className="text-gray-600 text-xs whitespace-nowrap ml-auto">
                        {`${distances[place.id]?.toFixed(1)} km`}
                      </div>
                    )}
                </div>
              ))
            ) : (
              <div className="h-full flex justify-center items-center">
                {query ? (
                  <div className="flex justify-center items-center text-muted-foreground text-sm">
                    No results found. Please try a different search term.
                  </div>
                ) : (
                  <div className="flex justify-center items-center text-muted-foreground text-sm">
                    No places yet. Begin your search above!
                  </div>
                )}
              </div>
            )}
          </div>{" "}
        </TabsContent>

        {/* place */}
        <TabsContent value="place">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for a place"
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
          <div className="h-[76%] max-h-[90%] mt-2 overflow-y-scroll no-scrollbar">
            {suggestions.length > 0 ? (
              suggestions.map((place) => (
                <div
                  key={place.id}
                  className="p-2 py-4 flex gap-5 items-center w-full cursor-pointer"
                  onClick={() => handleSelectSuggestion(place)}
                >
                  <MapPin
                    className={cn(
                      "text-zinc-500 min-w-4 min-h-4 w-4 h-4",
                      currentSelectedPlace === place.id && "text-foreground"
                    )}
                    strokeWidth={currentSelectedPlace === place.id ? 3 : 2}
                  />
                  <TooltipProvider>
                    <Tooltip delayDuration={1000}>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "break-all line-clamp-1 text-sm",
                            currentSelectedPlace === place.id && ""
                          )}
                        >
                          {place.place_name}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs max-w-96">
                          {place.place_name}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {distances?.[place.id] !== undefined &&
                    distances[place.id] !== null && (
                      <div className="text-gray-600 text-xs whitespace-nowrap ml-auto">
                        {`${distances[place.id]?.toFixed(1)} km`}
                      </div>
                    )}
                </div>
              ))
            ) : (
              <div className="h-full flex justify-center items-center">
                {query ? (
                  <div className="flex justify-center items-center text-muted-foreground text-sm">
                    No results found. Please try a different search term.
                  </div>
                ) : (
                  <div className="flex justify-center items-center text-muted-foreground text-sm">
                    No places yet. Begin your search above!
                  </div>
                )}
              </div>
            )}
          </div>{" "}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sidebar;
