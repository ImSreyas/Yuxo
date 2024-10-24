import SignUp from "./components/SignUp";
// import SignUpCover from "./components/SignUpCover";
import Map from "../components/Map";

const page = () => {
  return (
    <div className="w-full lg:grid lg:grid-cols-5 h-screen">
      <SignUp />
      {/* <SignUpCover /> */}
      <Map />
    </div>
  );
};

export default page;
