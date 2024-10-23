"use client";

import SubNav from "./components/SubNav";
import Buses from "./components/Buses";
import { useState } from "react";

const page = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [busStatus, setBusStatus] = useState(true);
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  return (
    <>
      <div className="pt-2 pb-8 px-2 sm:px-4 md:px-8 lg:px-12">
        <div className="text-2xl font-extrabold mb-4">buses</div>
        <div onClick={handleClick}>
        </div>
        <SubNav />
        <Buses />
      </div>
    </>
  );
};

export default page;
