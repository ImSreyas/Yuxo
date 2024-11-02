import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { X, Search, MapPin, LandPlot } from "lucide-react";
import ToolBar from "./ToolBar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GeocodeFeature } from "@mapbox/mapbox-sdk/services/geocoding";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import SideBarNav from "./SideBarNav";

interface SidebarProps {
  sideBarActive: boolean;
  query: string;
  setQuery: (value: string) => void;
  handleSearchClose: () => void;
  suggestions: GeocodeFeature[];
  currentSelectedPlace: string | undefined;
  handleSelectSuggestion: (place: GeocodeFeature) => void;
  distances: Record<string, number | null>;
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
}) => {
  const [activeTab, setActiveTab] = useState<string>("place");
  return (
    <div
      className={cn(
        "absolute w-100 top-0 left-0 z-10 px-5 py-6 bg-white h-full block transition-all duration-400 border-right border-r",
        sideBarActive ? "" : "-left-100"
      )}
    >
      <Tabs
        defaultValue="account"
        className="absolute inset-0 px-5 py-6"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        {/* top toolbar */}
        <SideBarNav activeTab={activeTab} setActiveTab={setActiveTab} />

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
      </Tabs>
    </div>
  );
};

export default Sidebar;
