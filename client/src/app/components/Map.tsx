"use client";

import { useRef, useEffect } from "react";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const Map = () => {
  const mapRef = useRef<MapboxMap | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [77.191492, 28.613945],
      zoom: 12,
      projection: "mercator",
    });

    const marker = new mapboxgl.Marker({color: "#F00"})
      .setLngLat([77.191492, 28.613945]) 
      .addTo(mapRef.current); 

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  return (
    <div id="map-container" ref={mapContainerRef} className="w-[100vw-4rem] h-screen" />
  );
};

export default Map;
