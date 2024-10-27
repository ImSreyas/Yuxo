"use client";

import { useEffect, useState } from "react";
import Card from "./BusCard";
import axios from "axios";
import useNewBusAddedStore from "@/store/useNewBusAddedStore";

// const Buses = ({ status: [busStatus, setBusStatus] }: any) => {
const Buses = () => {
  const [busesData, setBusData] = useState([]);
  const { busAdded, setBusAdded }: any = useNewBusAddedStore();

  const getBusData = async () => {
    setBusAdded(false);
    const {
      data: { response },
    } = await axios.post("/api/operator/bus/get");
    setBusData(response);
  };

  useEffect(() => {
    if (busAdded) {
      getBusData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busAdded]);

  useEffect(() => {
    getBusData();
  }, []);

  return (
    <div className="grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {busesData.map((busData: any) => (
        <Card key={busData.bus_id} busData={busData} />
      ))}
    </div>
  );
};

export default Buses;
