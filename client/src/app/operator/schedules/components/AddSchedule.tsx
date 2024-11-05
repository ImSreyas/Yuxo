"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, PanelRightClose, WandSparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import TimePicker from "./TimePicker";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

interface StopInfo {
  id: string;
  time: string;
}

// Dummy bus data
const dummyBuses = [
  { id: "bus1", name: "Express 101" },
  { id: "bus2", name: "Local 202" },
  { id: "bus3", name: "Rapid 303" },
  { id: "bus4", name: "Shuttle 404" },
];

// Zod schema for validation
const scheduleSchema = z.object({
  scheduleName: z.string().min(1, { message: "Schedule name is required" }),
  selectedBus: z.string().min(1, { message: "Please select a bus" }),
  stops: z
    .array(
      z.object({
        id: z.string().min(1, { message: "Place is required" }),
        time: z.string().min(1, { message: "Time is required" }),
      })
    )
    .min(2, { message: "At least two stops are required" }),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

export default function BusScheduleSheet({
  isAddScheduleBtn,
  routeId,
}: {
  isAddScheduleBtn: boolean;
  routeId: number | null;
}) {
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const [buses, setBuses] = useState<any[]>([]);
  const smallScreen = 640;
  const [route, setRoute] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
    control,
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      scheduleName: "",
      selectedBus: "",
      stops: Array(5).fill({ id: "", time: "" }),
    },
  });

  const stops = watch("stops");

  const handleStopChange = (
    index: number,
    field: keyof StopInfo,
    value: string
  ) => {
    setValue(`stops.${index}.${field}`, value);
  };

  const handleTimeChange = (index: number, time: string) => {
    for (let i = index; i < stops.length; i++) {
      setValue(`stops.${i}.time`, time);
    }
  };

  const handleFormSubmit = (data: ScheduleFormData) => {
    console.log(data); // Handle form submission here
    setOpen(false);
    reset(); // Reset the form after submission
  };

  const fetchBus = async () => {
    try {
      const {
        data: { response },
      } = await axios.post("/api/operator/bus/get");
      setBuses(response);
      // console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchRoute = async () => {
    try {
      const { data } = await axios.post("/api/operator/route/stops/get", {
        routeId,
      });
      // console.log("route is : ", data.data);
      setRoute(data.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    fetchBus();

    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (routeId) fetchRoute();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeId]);

  console.log(route);
  // console.log(routeId);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          className={cn(
            "hidden absolute bottom-4 right-4 z-20 px-6 rounded-lg justify-center items-center space-x-2",
            isAddScheduleBtn && "flex"
          )}
        >
          <WandSparkles className="w-4 h-4" />
          <span>Add schedule</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side={width < smallScreen ? "bottom" : "right"}
        className="w-full h-[90%] sm:h-full pt-10 pb-14 px-12 md:max-w-md lg:max-w-lg lg:px-14 overflow-y-scroll fixed"
      >
        <SheetHeader>
          <SheetTitle>Bus Schedule</SheetTitle>
          <SheetDescription>
            Enter the details for the new bus schedule.
          </SheetDescription>
        </SheetHeader>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4 mt-8"
        >
          <div className="space-y-2">
            <Label htmlFor="schedule-name">Schedule Name</Label>
            <Input
              id="schedule-name"
              placeholder="Enter schedule name"
              {...register("scheduleName")}
            />
            {errors.scheduleName && (
              <p className="text-red-500 text-sm">
                {errors.scheduleName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="bus-select">Select Bus</Label>
            <Select
              value={watch("selectedBus")}
              onValueChange={(value) => setValue("selectedBus", value)}
            >
              <SelectTrigger id="bus-select">
                <SelectValue placeholder="Select a bus">
                  {buses.find((bus) => bus.bus_id == watch("selectedBus"))
                    ?.bus_name || "Select a bus"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {buses.map((bus, index) => (
                  <SelectItem key={index} value={bus.bus_id}>
                    {bus.bus_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.selectedBus && (
              <p className="text-red-500 text-sm">
                {errors.selectedBus.message}
              </p>
            )}
          </div>
          <div className="space-y-4 pb-2">
            <Label>Stops</Label>
            {route.map((stop, index) => (
              <div key={index} className="flex items-end space-x-2">
                <div className="flex-1 space-y-2">
                  <Input
                    value={stop.tbl_bus_stops.stop_name}
                    placeholder={`Stop ${index + 1}`}
                    onChange={(e) =>
                      handleStopChange(index, "id", e.target.value)
                    }
                  />
                  {errors.stops?.[index]?.id && (
                    <p className="text-red-500 text-sm">
                      {errors.stops[index].id.message}
                    </p>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <TimePicker
                    value={stop.time}
                    onChange={(time) => handleStopChange(index, "time", time)}
                    onTimeChange={(time) => handleTimeChange(index, time)}
                  />
                  {errors.stops?.[index]?.time && (
                    <p className="text-red-500 text-sm">
                      {errors.stops[index].time.message}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Button type="submit" className="w-full">
            Add Schedule
          </Button>
        </form>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={() => setOpen(false)}
        >
          {width < smallScreen ? (
            <ChevronDown className="w-6 h-6" />
          ) : (
            <PanelRightClose className="h-5 w-5" />
          )}
        </Button>
      </SheetContent>
    </Sheet>
  );
}
