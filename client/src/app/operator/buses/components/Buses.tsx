"use client";

import { useEffect, useState } from "react";
import Card from "./BusCard";
import axios from "axios";

const Buses = ({ status: [busStatus, setBusStatus] }: any) => {
  const [busesData, setBusData] = useState([]);

  useEffect(() => {
    const getBusData = async () => {
      setBusStatus(false);
      const {
        data: { response },
      } = await axios.post("/api/operator/bus/get");
      setBusData(response);
      console.log(response);
    };
    if (busStatus) {
      getBusData();
    }
  }, [busStatus, setBusStatus]);

  return (
    <div className="grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {busesData.map((busData: any) => (
        <Card key={busData.bus_name} busData={busData} />
      ))}
    </div>
  );
};

export default Buses;
