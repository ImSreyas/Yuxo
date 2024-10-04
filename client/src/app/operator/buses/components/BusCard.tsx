import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bus, FileText, Hash, Palette, Users } from "lucide-react";

const BusCard = ({ busData: bus }: { busData: any }) => {

  return (
    <Card className="w-full max-w-md mx-auto rounded-xl overflow-hidden">
      <div className="flex justify-between pt-6 pb-5 px-8 text-xl">
        <div className="font-bold">{bus.bus_name}</div>
        <div className="font-bold">{bus.bus_id}</div>
      </div>
      <CardContent className="px-6 pb-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Registration</p>
              <p className="font-semibold">{bus.registration_number}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Capacity</p>
              <p className="font-semibold">{bus.bus_capacity} seats</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Bus className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Type</p>
              <p className="font-semibold">
                {bus.bus_type_id == 1 ? "SF" : "LS"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Palette className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Color</p>
              <div className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded-md border border-gray-300"
                  style={{ backgroundColor: bus.bus_color }}
                />
                <p className="font-semibold text-sm">{bus.bus_color}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusCard;
