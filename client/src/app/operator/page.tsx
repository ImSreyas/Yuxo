"use client";

import { Button } from "@/components/ui/button";
import Card from "./buses/components/BusCard";
import Search from "./buses/components/Search";
import SortButton from "./buses/components/SortButton";
import Nav from "./components/Nav";
import SubNav from "./buses/components/SubNav";
import Buses from "./buses/components/Buses";
import { useState } from "react";

const page = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [busStatus, setBusStatus] = useState(true);

  return (
    <>
      <Nav />
      <div className="pt-4 pb-8 px-6 sm:px-8 md:px-10 lg:px-16">
        <SubNav status={[busStatus, setBusStatus]}/>
        <Buses status={[busStatus, setBusStatus]}/>
      </div>
    </>
  );
};

export default page;
