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
import { toast } from "sonner";

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
  stops: z.array(
    z.object({
      id: z.string().min(1, { message: "Bus stop ID is required" }),
      time: z.string().min(1, { message: "Time is required" }),
    })
  ),
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
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      scheduleName: "",
      selectedBus: "",
      stops: [],
    },
  });

  // const handleTimeChange = (busStopId: string, time: string) => {
  //   console.log("working");
  //   console.log(busStopId, time);
  //   const currentStops = watch("stops") || [];
  //   const updatedStops = currentStops.map((stop) =>
  //     stop.id === busStopId ? { ...stop, time } : stop
  //   );
  //   setValue("stops", updatedStops);
  // };

  const handleTimeChange = (busStopId: string, time: string) => {
    const currentStops = watch("stops") || [];
    const updatedStops = currentStops.map((stop, index) => {
      // Update the time for the selected stop and all subsequent stops
      if (currentStops.findIndex((s) => s.id == busStopId) <= index) {
        return { ...stop, time };
      }
      return stop;
    });
    setValue("stops", updatedStops);
  };

  const handleFormSubmit = async (data: ScheduleFormData) => {
    console.log(data); // Handle form submission here
    // const { res, error }: any = await supabase.rpc("create_schedule", {
    //   ...data,
    //   route_id: routeId,
    //   runningDays: ["Monday", "Tuesday", "Wednesday"],
    //   status: true,
    // });
    // const user: any = await supabase.auth.getUser();
    // console.log(user.data.user.id);
    const scheduleData = {
      schedule_name: data.scheduleName,
      route_id: routeId,
      selected_bus: data.selectedBus,
      stops: data.stops,
      running_days: ["Monday", "Tuesday", "Wednesday"],
      status: true,
    };

    const { res, err }: any = await axios.put(
      "/api/operator/schedule/add",
      scheduleData
    );
    if (err) {
      console.log(err);
      return;
    }
    // console.log(res);
    setOpen(false);
    reset();

    toast("Successful", {
      description: "New schedule added successfully",
      action: {
        label: "Close",
      },
      position: "top-center",
      duration: 6000,
    });
  };

  const fetchBus = async () => {
    try {
      const {
        data: { response },
      } = await axios.post("/api/operator/bus/get");
      setBuses(response);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchRoute = async () => {
    try {
      const { data } = await axios.post("/api/operator/route/stops/get", {
        routeId,
      });
      const initialStops = data.data.map((stop: any) => ({
        id: stop.route_stop_id.toString(),
        time: "",
      }));
      setRoute(data.data);
      setValue("stops", initialStops); // Initialize stops with route bus_stop_id
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    fetchBus();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // const formData = watch();
  // useEffect(() => {
  //   console.log(formData);
  //   console.log(route);
  //   console.log(errors);
  // }, [formData]);

  useEffect(() => {
    if (routeId) fetchRoute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeId]);

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
        className="min-w-[520px] h-[90%] sm:h-full pt-10 pb-14 px-12 md:max-w-md lg:max-w-lg lg:px-14 overflow-y-scroll fixed"
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
            {route.map((stop: any, index) => (
              <div
                key={stop.bus_stop_id}
                className="flex items-center space-x-2"
              >
                <div className="flex-1">
                  <Label>{stop.tbl_bus_stops.stop_name}</Label>
                </div>
                <div className="flex-1 space-y-2">
                  <TimePicker
                    value={
                      watch("stops")?.find((s) => s.id == stop.route_stop_id)
                        ?.time || ""
                    }
                    onTimeChange={(time) =>
                      handleTimeChange(stop.route_stop_id, time)
                    }
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
