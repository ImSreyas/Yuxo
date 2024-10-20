"use client";

import SubNav from "./components/SubNav";
import Buses from "./components/Buses";
import { useState } from "react";

const page = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [busStatus, setBusStatus] = useState(true);

  return (
    <>
      <div className="pt-2 pb-8 px-2 sm:px-4 md:px-8 lg:px-12">
        <div className="text-2xl font-extrabold mb-4">buses</div>
        <SubNav status={[busStatus, setBusStatus]} />
        <Buses status={[busStatus, setBusStatus]} />
      </div>
    </>
  );
};

export default page;
