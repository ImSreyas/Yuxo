"use client";

import { useRef, useEffect, useState } from "react";
import mapboxgl, { LngLatLike, Map as MapboxMap, Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxGeocoding, {
  GeocodeFeature,
} from "@mapbox/mapbox-sdk/services/geocoding";
import MapboxDirections from "@mapbox/mapbox-sdk/services/directions";
import { Input } from "@/components/ui/input";
import { ChevronsLeft, MapPin, Search, StepBack, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ToolBar from "./ToolBar";
import { cn } from "@/lib/utils";
import { number } from "zod";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const geocodingClient = MapboxGeocoding({ accessToken: mapboxgl.accessToken });
const directionsClient = MapboxDirections({
  accessToken: mapboxgl.accessToken,
});

const Map: React.FC = () => {
  const mapRef = useRef<MapboxMap | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<GeocodeFeature[]>([]);
  const [currentSelectedPlace, setCurrentSelectedPlace] = useState<string>();
  const [distances, setDistances] = useState<Record<string, number | null>>({});
  const markerRef = useRef<Marker | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const calculateOffset = (longitude: number) => {
    const offsetLongitude = 0.017;
    return longitude - offsetLongitude;
  };

  const handleSearchClose = (e: any) => {
    setQuery("");
  };

  const [currentLocation, setCurrentLocation] = useState<[number, number]>([
    77.191492, 28.613945,
  ]);

  // console.log(distances, suggestions);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [calculateOffset(currentLocation[0]), currentLocation[1]],
      zoom: 13,
      projection: "mercator",
    });

    markerRef.current = new mapboxgl.Marker({ color: "#F00", offset: [0, 0] })
      .setLngLat(currentLocation)
      .addTo(mapRef.current!);

    return () => {
      mapRef.current?.remove();
    };
  }, [currentLocation]);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      fetchSuggestions();
    }, 800);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [query]);

  const fetchSuggestions = async () => {
    if (!query) {
      setSuggestions([]);
      setDistances({});
      return;
    }

    try {
      const response = await geocodingClient
        .forwardGeocode({
          query,
          limit: 10,
        })
        .send();

      const fetchedSuggestions = response.body.features;
      setSuggestions(fetchedSuggestions);
      // console.log("Fetched suggestions:", fetchedSuggestions);

      if (currentLocation) {
        const newDistances: Record<string, number | null> = {};
        for (const place of fetchedSuggestions) {
          const distance = await fetchDistance(
            currentLocation,
            place.center as [number, number]
          );
          newDistances[place.id] = distance;
        }
        // console.log(newDistances);
        setDistances(newDistances);
      }
    } catch (error) {
      // console.error("Error fetching suggestions:", error);
    }
  };

  const fetchDistance = async (
    currentLocation: [number, number],
    destination: [number, number]
  ) => {
    try {
      const response = await directionsClient
        .getDirections({
          profile: "driving",
          waypoints: [
            { coordinates: currentLocation },
            { coordinates: destination },
          ],
        })
        .send();

      if (response.body.routes && response.body.routes.length > 0) {
        const distanceInKm = response.body.routes[0].distance / 1000;
        return distanceInKm;
      } else {
        // console.error("No routes found in the response:", response.body);
        return null;
      }
    } catch (error) {
      // console.error("Error fetching road distance:", error);
      return null;
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        setCurrentLocation([longitude, latitude]);
      },
      (error) => {
        // console.error("Error getting current location:", error);
        setCurrentLocation([77.191492, 28.613945]);
      }
    );
  }, []);

  const handleSelectSuggestion = (place: GeocodeFeature) => {
    setCurrentSelectedPlace(place.id);
    const [longitude, latitude] = place.center;

    mapRef.current?.easeTo({
      center: [longitude, latitude],
      zoom: 16,
      duration: 1200,
      offset: [200, 0],
    });

    markerRef.current?.setLngLat([longitude, latitude]).addTo(mapRef.current!);

    // setSuggestions([]);
    // setQuery(place.place_name);
  };

  return (
    <div className="relative block">
      <div className="block h-full">
        <div className="absolute w-100 top-0 left-0 z-10 px-5 py-6 bg-white h-full block">
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
          {/* <div className="border-b-1 border-zinc-200 my-1"></div> */}
          <div className="h-[80%] mt-1 overflow-y-scroll no-scrollbar">
            {suggestions.length > 0 ? (
              suggestions.map((place) => (
                <div
                  key={place.id}
                  className={cn(
                    "p-2 py-4 flex gap-5 items-center w-full cursor-pointer"
                  )}
                  onClick={() => handleSelectSuggestion(place)}
                >
                  {/* <div
                  className={cn(
                    "min-w-2 min-h-2 bg-foreground rounded-full absolute -left-1",
                    currentSelectedPlace == place.id ? "block" : "hidden"
                  )}
                ></div> */}
                  <MapPin
                    className={cn(
                      "text-zinc-500 min-w-4 min-h-4 w-4 h-4",
                      currentSelectedPlace == place.id && "text-foreground"
                    )}
                    strokeWidth={currentSelectedPlace == place.id ? 3 : 2}
                  />
                  <TooltipProvider>
                    <Tooltip delayDuration={1000}>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "break-all line-clamp-1 text-sm",
                            currentSelectedPlace == place.id && ""
                          )}
                        >
                          {place.place_name}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className={cn("text-xs max-w-96")}>
                          {place.place_name}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {distances[place.id] !== undefined &&
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
          </div>
        </div>
        <button className="absolute top-1/2 -translate-y-1/2 left-[25.5rem] z-20 w-fit h-fit py-4 px-1 rounded-lg bg-background">
          <ChevronsLeft className="h-4 w-4" />
        </button>
      </div>

      <div
        id="map-container"
        ref={mapContainerRef}
        className="w-[calc(100vw-4rem)] h-screen"
      />
    </div>
  );
};

export default Map;
