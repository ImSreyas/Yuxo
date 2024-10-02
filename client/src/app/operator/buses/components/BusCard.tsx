import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const BusCard = ({ busData: bus }: { busData: any }) => {
  const value = Math.floor(Math.random() * 10) + 1;

  return (
    <Card className="w-full max-w-md px-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">{bus.bus_name}</CardTitle>
        <Badge variant={bus.is_ksrtc ? "default" : "secondary"}>
          {bus.is_ksrtc ? "KSRTC" : "Private"}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 mt-1">
          <div className="flex items-center space-x-4">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">Bus Number</p>
              <p className="text-xl font-bold">{bus.bus_number}</p>
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">Registration</p>
              <p className="text-xl">{bus.registration_number}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">Capacity</p>
              <p className="text-xl">{bus.bus_capacity} seats</p>
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">Bus Type</p>
              <p className="text-xl">{bus.bus_type_id === 1 ? "SF" : "FP"}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">Bus ID</p>
              <p className="text-xl">{bus.bus_id}</p>
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">Color</p>
              <div className="flex items-center space-x-2">
                <div
                  className="h-4 w-4 rounded-full border"
                  style={{ backgroundColor: bus.bus_color }}
                />
                <p className="text-sm">{bus.bus_color}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusCard;
