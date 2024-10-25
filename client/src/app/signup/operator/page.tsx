import SignUp from "./components/SignUp";
// import SignUpCover from "./components/SignUpCover";
import Map from "../components/Map";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const page = () => {
  return (
    <div className="lg:grid-cols-5 xl:min-h-screen w-full grid h-screen">
      <Link
        href="/"
        className="absolute top-4 left-4 lg:left-auto lg:right-4 z-10 flex items-center gap-2 py-3 px-3 lg:py-2 lg:px-4 bg text-background rounded-xl text-sm bg-black/40 backdrop-blur-md border border-black/10 shadow-lg"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
        <span className="hidden lg:block">Back to Home</span>
      </Link>
      <SignUp />
      {/* <SignUpCover /> */}
      <Map />
    </div>
  );
};

export default page;
