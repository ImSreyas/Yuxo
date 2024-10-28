"use client";

import { useRef, useEffect, useState } from "react";
import mapboxgl, { LngLatLike, Map as MapboxMap, Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxGeocoding, {
  GeocodeFeature,
} from "@mapbox/mapbox-sdk/services/geocoding";
import MapboxDirections from "@mapbox/mapbox-sdk/services/directions";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Locate,
  LocateFixed,
  MapPin,
  Search,
  StepBack,
  X,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ToolBar from "./ToolBar";
import { cn } from "@/lib/utils";
import { number } from "zod";
import { Button } from "@/components/ui/button";

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
  const selectedLocationRef = useRef<Marker | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [sideBarActive, setSideBarActive] = useState<boolean>(true);
  const [markedLocation, setMarkedLocation] = useState<[number, number] | null>(
    null
  );
  const [showMarkerCard, setShowMarkerCard] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([
    77.191492, 28.613945,
  ]);

  const calculateOffset = (longitude: number) => {
    const offsetLongitude = 0.017;
    return longitude - offsetLongitude;
  };

  const handleSearchClose = (e: any) => {
    setQuery("");
  };

  const triggerSideBarActive = (e: any) => {
    setSideBarActive((prev) => !prev);
  };

  const handleLocationMarking = ([lng, lat]: [number, number]): void => {
    setShowMarkerCard(true);
  };
  const handleMarkerClose = (e: any) => {
    if (selectedLocationRef.current) {
      selectedLocationRef.current.remove();
      selectedLocationRef.current = null;
      setShowMarkerCard(false);
      // setMarkedLocation(null);
    }
  };

  const fetchCurrentLocation = () => {
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
  };

  const moveToCenter = () => {
    setCurrentSelectedPlace("");
    mapRef.current?.easeTo({
      center: currentLocation,
      zoom: 13,
      duration: 1200,
      offset: [200, 0],
    });

    markerRef.current?.setLngLat(currentLocation).addTo(mapRef.current!);
  };

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

    mapRef.current.on("click", (event) => {
      const [lng, lat] = [event.lngLat.lng, event.lngLat.lat];
      setMarkedLocation([lng, lat]);

      // Place or update the marker at the clicked location
      if (selectedLocationRef.current) {
        selectedLocationRef.current.setLngLat([lng, lat]);
      } else {
        selectedLocationRef.current = new mapboxgl.Marker({ color: "#000" })
          .setLngLat([lng, lat])
          .addTo(mapRef.current!);
      }
      handleLocationMarking([lng, lat]);
    });

    return () => {
      mapRef.current?.remove();
      selectedLocationRef.current?.remove();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    fetchCurrentLocation();
  }, []);

  const handleSelectSuggestion = (place: GeocodeFeature) => {
    setCurrentSelectedPlace(place.id);
    const [longitude, latitude] = place.center;

    mapRef.current?.easeTo({
      center: [longitude, latitude],
      zoom: 15,
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
        <div
          className={cn(
            "absolute w-100 top-0 left-0 z-10 px-5 py-6 bg-white h-full block transition-all duration-400",
            sideBarActive ? "" : "-left-100"
          )}
        >
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
          <div className="h-[76%] max-h-[90%] mt-2 overflow-y-scroll no-scrollbar">
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
        <button
          className={cn(
            "absolute top-1/2 -translate-y-1/2 left-[25.5rem] z-20 w-fit h-fit py-4 px-2 rounded-xl bg-background border border-zinc-300 shadow-sm transition-all duration-400",
            sideBarActive ? "" : "left-2"
          )}
          onClick={triggerSideBarActive}
        >
          {sideBarActive ? (
            <ChevronsLeft className="h-4 w-4" />
          ) : (
            <ChevronsRight className="h-4 w-4" />
          )}
        </button>
      </div>

      <div
        className={cn(
          "absolute  right-4 z-20 bg-background bottom-0 translate-y-[100%] transition-all duration-300 px-4 pb-4 pt-2 rounded-lg grid grid-cols-2 gap-x-3 auto-rows-min",
          showMarkerCard ? "translate-y-0 bottom-4" : ""
        )}
      >
        <div className="col-span-2 flex justify-end">
          <button
            className="bg-muted p-1 rounded-md cursor-pointer"
            onClick={handleMarkerClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="text-xs px-1">
          <div className="bg-muted w-fit px-2 py-[1px] rounded-md mb-1 text-2xs">
            Latitude
          </div>
          <div className="border-l border-black px-2">
            {markedLocation?.[1]}
          </div>
        </div>
        <div className="text-xs px-1">
          <div className="bg-muted w-fit px-2 py-[1px] rounded-md mb-1 text-2xs">
            Longitude
          </div>
          <div className="border-l border-black px-2">
            {markedLocation?.[0]}
          </div>
        </div>
        <div className="col-span-2 mt-3">
          <Button className="w-full flex gap-1 justify-center">
            <div>continue</div>
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="absolute top-4 right-4 p-3 rounded-full bg-background z-20 shadow-xl cursor-pointer"
              onClick={moveToCenter}
            >
              <LocateFixed className="h-5 w-5" />
            </div>
          </TooltipTrigger>
          <TooltipContent className="mx-2">
            <p>Current Location</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div
        id="map-container"
        ref={mapContainerRef}
        className="w-[calc(100vw-4rem)] h-screen"
      />
    </div>
  );
};

export default Map;
