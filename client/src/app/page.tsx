import Map from "./components/Map";
import "mapbox-gl/dist/mapbox-gl.css"; // Import the Mapbox CSS globally

// const Map = dynamic(() => import('./Map'), { ssr: false });

export default function Home() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Map />
    </div>
  );
}
