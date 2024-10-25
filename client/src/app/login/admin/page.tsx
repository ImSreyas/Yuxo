import Login from "./components/Login";
import Map from "./components/Map";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function page() {

  return (
    <div className="w-full bg-background flex justify-center items-center min-h-screen relative">
      <Link
        href="/"
        className="absolute top-4 left-4 z-10 flex items-center gap-2 py-3 px-3 lg:py-2 lg:px-4 bg text-background rounded-xl text-sm bg-black/40 backdrop-blur-md border border-black/10 shadow-lg"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
        <span className="hidden lg:block">Back to Home</span>
      </Link>
      <Map />
      <Login />
    </div>
  );
}
