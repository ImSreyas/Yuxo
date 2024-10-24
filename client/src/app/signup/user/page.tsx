import SignUp from "./components/SignUp";
import SignUpCover from "./components/SignUpCover";
import Map from "../components/Map";

const page = () => {
  return (
    <div className="lg:grid-cols-5 xl:min-h-screen w-full lg:grid lg:h-screen">
      <Map />
      <SignUp />
    </div>
  );
};

export default page;
