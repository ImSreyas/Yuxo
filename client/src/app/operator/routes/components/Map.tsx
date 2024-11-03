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
  AudioWaveform,
  ChevronsLeft,
  ChevronsRight,
  LocateFixed,
  MapPin,
  Search,
  Spline,
  TicketPlus,
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
import { Button } from "@/components/ui/button";
import AddStop from "./AddStop";
import supabase from "@/utils/supabase/client";
import SideBar from "./SideBar";
import AddRoute from "./AddRoute";
import axios from "axios";

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
  const [isAddBusDialogOpen, setIsAddBusDialogOpen] = useState<boolean>(false);
  const [isAddRouteDialogOpen, setIsAddRouteDialogOpen] =
    useState<boolean>(false);
  const [selectedStops, setSelectedStops] = useState<any>([]);
  const [routes, setRoutes] = useState<any>([]);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);

  const calculateOffset = (longitude: number, zoom: number = 13) => {
    switch (zoom) {
      case 13:
        return longitude - 0.017;
      case 14:
        return longitude - 0.009;
    }
    return longitude - 0.017;
  };

  const handleSearchClose = (e?: any) => {
    setQuery("");
  };

  const triggerSideBarActive = (e: any) => {
    setSideBarActive((prev) => !prev);
  };

  const handleLocationMarking = ([lng, lat]: [number, number]): void => {
    setShowMarkerCard(true);
  };
  const handleMarkerClose = (e?: any) => {
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

  interface BusStopProperties {
    stop_id: number;
    stop_name: string;
    operator_id: string;
    status: boolean;
    stop_type: string;
  }

  interface BusStop {
    location: {
      coordinates: [number, number]; // [lng, lat]
    };
    stop_id: number;
    stop_name: string;
    operator_id: string;
    status: boolean;
    stop_type: string;
  }

  // Function for fetching all bus stop markers from db.
  const fetchAllStops = async (): Promise<any> => {
    const { data, error } = await supabase.from("tbl_bus_stops").select("*");

    if (error) {
      console.error("Error fetching stops:", error);
      return null;
    }

    if (!data) {
      console.error("No data found");
      return null;
    }

    const geoJsonData = {
      type: "FeatureCollection",
      features: data.map((stop) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: stop.location.coordinates,
        },
        properties: {
          stop_id: stop.stop_id,
          stop_name: stop.stop_name,
          operator_id: stop.operator_id,
          status: stop.status,
          stop_type: stop.stop_type,
        },
      })),
    };

    return geoJsonData;
  };

  // An array for storing the bus stop markers
  let busStopMarkers: mapboxgl.Marker[] = [];
  const markerZoomThreshold = 14;

  const refreshBusStops = async () => {
    // Remove existing markers before refreshing
    clearMarkers();

    const geoJsonData = await fetchAllStops();
    const busStopsSource = mapRef.current?.getSource("busStops");

    if (geoJsonData && busStopsSource && "setData" in busStopsSource) {
      // Set the new GeoJSON data to the source
      busStopsSource.setData(geoJsonData);
      addBusStopMarkers(geoJsonData);
    } else {
      console.error("Unable to update bus stops source: Source may not exist.");
    }
  };

  // Function to remove existing markers
  const clearMarkers = () => {
    busStopMarkers.forEach((marker) => marker.remove());
    busStopMarkers = []; // Clear the markers array
  };

  const addBusStopMarkers = (geoJsonData: any) => {
    // Clear existing markers
    clearMarkers();

    // Add new markers
    geoJsonData.features.forEach((stop: any) => {
      const [longitude, latitude] = stop.geometry.coordinates;

      if (mapRef.current) {
        const marker = new mapboxgl.Marker({ color: "#000" })
          .setLngLat([longitude, latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<center><strong>${stop.properties.stop_name}</strong><br><strong>${stop.properties.stop_type}</strong></center>`
            )
          )
          .addTo(mapRef.current);

        // Store the marker in the array for future reference
        busStopMarkers.push(marker);
      } else {
        console.error("Map instance is not available.");
      }
    });
  };
  // Function for adding the GeoJSON data layer to the map
  const addBusStopToCanvas = () => {
    mapRef.current?.on("load", async () => {
      const geoJsonData = await fetchAllStops();
      if (!geoJsonData) {
        console.error("No GeoJSON data available");
        return;
      }

      mapRef.current?.addSource("busStops", {
        type: "geojson",
        data: geoJsonData,
      });

      // Normal markers
      // Adding bus stop markers
      addBusStopMarkers(geoJsonData);

      // ! The below part made functional (addBusStopMarkers)
      // geoJsonData.features.forEach((stop: any) => {
      //   const [longitude, latitude] = stop.geometry.coordinates;

      //   if (mapRef.current) {
      //     new mapboxgl.Marker({ color: "#000" })
      //       .setLngLat([longitude, latitude])
      //       .setPopup(
      //         new mapboxgl.Popup({ offset: 25 }).setHTML(
      //           `<strong>${stop.properties.stop_name}</strong>`
      //         )
      //       )
      //       .addTo(mapRef.current);
      //   } else {
      //     console.error("Map instance is not available.");
      //   }
      // });

      // Bus stop label
      mapRef.current?.addLayer({
        id: "busStopsLabelLayer",
        type: "symbol",
        source: "busStops",
        layout: {
          "text-field": ["get", "stop_name"],
          "text-size": 13,
          "text-anchor": "top",
          "text-offset": [0, 0.2],
          "text-allow-overlap": true,
        },
        paint: {
          "text-color": "#000",
          "text-halo-color": "#fff",
          "text-halo-width": 2,
        },
      });

      // ? Image markers (now using the normal markers)

      // mapRef.current?.loadImage("/bus_stop.png", (error, image: any) => {
      //   if (error) throw error;

      //   mapRef.current?.addImage("bus-icon", image);

      //   mapRef.current?.addLayer({
      //     id: "busStopsLayer",
      //     type: "symbol",
      //     source: "busStops",
      //     layout: {
      //       "icon-image": "bus-icon",
      //       "icon-size": 0.07,
      //       "icon-allow-overlap": true,
      //     },
      //   });

      // });

      // ? Shape markers (now using the normal markers)
      // mapRef.current?.addLayer({
      //   id: "busStopsLayer",
      //   type: "circle",
      //   source: "busStops",
      //   paint: {
      //     "circle-radius": 4,
      //     "circle-color": "#000",
      //   },
      // });

      const updateGeoJsonLayerVisibility = () => {
        const currentZoom = mapRef.current?.getZoom();
        if (mapRef.current && currentZoom) {
          if (currentZoom < markerZoomThreshold) {
            // Hide the GeoJSON layer if zoom is below the threshold
            mapRef.current.setLayoutProperty(
              "busStopsLabelLayer",
              "visibility",
              "none"
            );
          } else {
            // Show the GeoJSON layer if zoom is above the threshold
            mapRef.current.setLayoutProperty(
              "busStopsLabelLayer",
              "visibility",
              "visible"
            );
          }
        }
      };
      const refreshMarkersOnZoom = async () => {
        // console.log(busStopMarkers);
        updateGeoJsonLayerVisibility();
      };

      // Attach the zoom event listener to control marker visibility
      mapRef.current?.on("zoom", refreshMarkersOnZoom);
      updateGeoJsonLayerVisibility();

      mapRef.current?.on("click", "busStopsLayer", (e) => {
        if (e.features && e.features.length > 0) {
          const properties = e.features[0].properties as BusStopProperties;
          const { stop_name, stop_type } = properties;

          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<strong>${stop_name}</strong><br>Type: ${stop_type}`)
            .addTo(mapRef.current!);
        }
      });

      mapRef.current?.on("mouseenter", "busStopsLayer", () => {
        const canvas = mapRef.current?.getCanvas();
        if (canvas) {
          canvas.style.cursor = "pointer";
        }
      });

      mapRef.current?.on("mouseleave", "busStopsLayer", () => {
        const canvas = mapRef.current?.getCanvas();
        if (canvas) {
          canvas.style.cursor = "";
        }
      });
    });
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [calculateOffset(currentLocation[0]), currentLocation[1]],
      zoom: 13,
      projection: "mercator",
    });

    addBusStopToCanvas();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  useEffect(() => {
    // Check if the map and selected stops data are available
    if (!mapRef.current || selectedStops.length === 0) return;

    // Extract coordinates from each selected stop
    const coordinates = selectedStops.map(
      (stop: any) => stop.location.coordinates
    );

    // Define the GeoJSON LineString
    const geoJsonData: any = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: coordinates, // Array of [longitude, latitude]
      },
    };

    // Add source and layer to the map for the path
    if (mapRef.current.getSource("route")) {
      mapRef.current.removeLayer("route-layer");
      mapRef.current.removeSource("route");
    }

    mapRef.current.addSource("route", {
      type: "geojson",
      data: geoJsonData,
    });

    mapRef.current.addLayer({
      id: "route-layer",
      type: "line",
      source: "route",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        // "line-color": "#ff7f50",
        "line-color": "#000",
        "line-width": 5,
      },
    });

    // Clean up on component unmount
    return () => {
      if (mapRef.current && mapRef.current.getSource("route")) {
        mapRef.current.removeLayer("route-layer");
        mapRef.current.removeSource("route");
      }
    };
  }, [mapRef, selectedStops]);

  const handleAddRoute = () => {
    setIsAddRouteDialogOpen(true);
  };

  const fetchRoutes = async () => {
    try {
      const res = await axios.post("/api/operator/route/get");
      setRoutes(res.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  // useEffect for fetching routes
  useEffect(() => {
    fetchRoutes();
  }, []);

  console.log(selectedRoute);

  const showRoutePath = () => {
    if (!selectedRoute || !selectedRoute.route_geometry) {
      console.warn("No route data available.");
      return;
    }

    const coordinates = selectedRoute.route_geometry.coordinates;

    if (!mapRef.current) {
      return;
    }

    // Remove the existing route layer if it exists to avoid duplicates
    if (mapRef.current.getLayer("route-path")) {
      mapRef.current.removeLayer("route-path");
      mapRef.current.removeSource("route-path");
    }

    const geoJSON: any = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: coordinates,
      },
    };

    // Add the route as a GeoJSON source
    mapRef.current.addSource("route-path", {
      type: "geojson",
      data: geoJSON,
    });

    // Add the path as a line layer on the map
    mapRef.current.addLayer({
      id: "route-path",
      type: "line",
      source: "route-path",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#000",
        "line-width": 4,
      },
    });

    const initialLocation: any = [
      calculateOffset(coordinates[0][0], 14),
      coordinates[0][1],
    ];

    // Smoothly ease to the starting point of the route
    mapRef.current.easeTo({
      center: initialLocation,
      zoom: 14,
      duration: 1200,
    });

    busStopMarkers = busStopMarkers.filter((marker) => {
      const markerLngLat = marker.getLngLat();
      const isOnPath = coordinates.some(
        ([lng, lat]: any) =>
          lng === markerLngLat.lng && lat === markerLngLat.lat
      );

      if (isOnPath) {
        marker.remove(); 
      }

      return !isOnPath; 
    });
  };

  useEffect(() => {
    showRoutePath();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoute]);

  return (
    <div className="relative block">
      <div className="block h-full">
        {/* side bar block  */}
        <SideBar
          sideBarActive={sideBarActive}
          query={query}
          setQuery={setQuery}
          handleSearchClose={handleSearchClose}
          suggestions={suggestions}
          currentSelectedPlace={currentSelectedPlace}
          handleSelectSuggestion={handleSelectSuggestion}
          distances={distances}
          selectedStops={selectedStops}
          setSelectedStops={setSelectedStops}
          routes={routes}
          setSelectedRoute={setSelectedRoute}
        />
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

      {selectedStops.length > 1 && (
        <Button
          className="absolute right-4 bottom-4 z-20 rounded-lg px-8 space-x-2 flex justify-center items-center"
          onClick={handleAddRoute}
        >
          <div>Add route</div>
          <TicketPlus className="w-4 h-4" />
        </Button>
      )}

      {/* Marker card  */}
      <div
        className={cn(
          "absolute  right-4 z-20 bg-background bottom-0 translate-y-[100%] transition-all duration-300 px-4 pb-4 pt-2 rounded-lg grid grid-cols-2 gap-x-3 auto-rows-min",
          showMarkerCard ? "translate-y-0 bottom-4" : ""
        )}
      >
        <div className="col-span-2 flex justify-between mb-2">
          <div className="p-1 text-sm">Add bus stop</div>
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
          <Button
            className="w-full flex gap-1 justify-center"
            onClick={() => {
              setIsAddBusDialogOpen(true);
            }}
          >
            <div>continue</div>
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Move to center button  */}
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

      <AddStop
        isOpen={isAddBusDialogOpen}
        setIsOpen={setIsAddBusDialogOpen}
        point={markedLocation || [0, 0]}
        handleMarkerClose={handleMarkerClose}
        refreshBusStops={refreshBusStops}
      />

      <AddRoute
        isOpen={isAddRouteDialogOpen}
        setIsOpen={setIsAddRouteDialogOpen}
        selectedStops={selectedStops}
      />

      {/* Map  */}
      <div
        id="map-container"
        ref={mapContainerRef}
        className="w-[calc(100vw-4rem)] h-screen"
      />
    </div>
  );
};

export default Map;
