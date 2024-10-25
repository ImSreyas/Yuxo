"use client";

import { useRef, useEffect } from "react";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import useWindowSize from "@/hooks/useWindowSize";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const Map = () => {
  const mapRef = useRef<MapboxMap | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const { width } = useWindowSize();
  const responsiveSize = 640;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [77.191999, 28.613945],
      zoom: 12,
      projection: "mercator",
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  return width >= responsiveSize ? (
    <div
      id="map-container"
      ref={mapContainerRef}
      className="w-screen h-screen absolute inset-0"
    />
  ) : (
    <></>
  );
};

export default Map;
