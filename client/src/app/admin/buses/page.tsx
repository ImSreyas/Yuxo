"use client";

import SubNav from "./components/SubNav";
import Buses from "./components/Buses";
import { useState } from "react";

const page = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [busStatus, setBusStatus] = useState(true);

  return (
    <>
      <div className="pt-4 pb-8 px-6 sm:px-8 md:px-10 lg:px-16">
        <SubNav status={[busStatus, setBusStatus]} />
        <Buses status={[busStatus, setBusStatus]} />
      </div>
    </>
  );
};

export default page;
