"use client";

import Nav from "./components/Nav";
import SubNav from "./buses/components/SubNav";
import Buses from "./buses/components/Buses";

const page = () => {

  return (
    <>
      {/* <Nav /> */}
      <div className="py-10 px-6 sm:px-8 md:px-10 lg:px-16">
        <SubNav />
        <Buses />
      </div>
    </>
  );
};

export default page;
