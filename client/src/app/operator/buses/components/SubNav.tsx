"use client";

import useWindowSize from "@/hooks/useWindowSize";
import Search from "./Search";
import SortButton from "./SortButton";
import { Button } from "@/components/ui/button";
import AddBus from "./AddBus";
import { useState } from "react";

// const SubNav = ({status}: any) => {
const SubNav = () => {
  const sortBtnPosChangeSize = 880;
  const { width } = useWindowSize(100);
  const smallScreen = 640;
  const sideBarState = useState(false);
  const [sideBar, setSideBar] = sideBarState;

  return (
    <div className="pb-10 flex flex-col items-end gap-4 md:gap-4 md:flex-row md:justify-between md:items-center lg:grid lg:grid-cols-5 lg:justify-items-center">
      {width >= sortBtnPosChangeSize && (
        <SortButton className="col-span-1 justify-self-start" />
      )}
      <Search className="col-span-3" />
      <div className="flex justify-center items-center gap-x-2 justify-self-end">
        {width <= sortBtnPosChangeSize && (
          <SortButton className="col-span-1 justify-self-start" />
        )}
        <Button onClick={() => setSideBar(true)} className="p-6 rounded-full">
          {width < smallScreen ? "Add Bus" : "Add new Bus"}
        </Button>
        <AddBus state={sideBarState} />
      </div>
    </div>
  );
};

export default SubNav;
