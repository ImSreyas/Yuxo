import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useForm,
  SubmitHandler,
  FormProvider,
  useWatch,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import axios from "axios";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

const schema = z.object({
  busStopLabel: z.string().min(1, "Bus stop label is required"),
  busStopType: z.enum(["bus_stand", "bus_shelter", "bus_stop", "food_stop"]),
});

enum BusStopType {
  BusStand = "bus_stand",
  BusShelter = "bus_shelter",
  BusStop = "bus_stop",
  FoodStop = "food_stop",
}

type BusStop = {
  label: String;
  lat: number;
  long: number;
  stop_type: String;
};

type FormData = {
  busStopLabel: string;
  busStopType: "bus_stand" | "bus_shelter" | "bus_stop" | "food_stop";
};

// Fun component
const AddStop = ({
  isOpen,
  setIsOpen,
  point,
  handleMarkerClose,
  refreshBusStops,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  point: [number, number];
  handleMarkerClose: (e?: any) => void;
  refreshBusStops: () => void;
}) => {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      busStopType: BusStopType.BusStop,
    },
  });

  const [isBusStopExists, setIsBusStopExists] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const busStopType = useWatch({ control: form.control, name: "busStopType" });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    // console.log(data.busStopLabel);
    setIsBusStopExists(false);
    setIsLoading(true);
    try {
      const BusStopData: BusStop = {
        label: data.busStopLabel,
        lat: point[1],
        long: point[0],
        stop_type: data.busStopType,
      };
      const res = await axios.put("/api/operator/bus/stop/add", BusStopData);
      if (res.data.success) {
        setIsOpen(false);
        toast("Success", {
          description: "Bus stop added successfully",
          action: {
            label: "Close",
          },
          position: "top-center",
          duration: 6000,
        });
        handleMarkerClose();
        refreshBusStops();
      }
    } catch (e: any) {
      console.log(e.response.data.data.code);
      if (e?.response?.data?.data?.code == 23505) {
        setIsBusStopExists(true);
      }
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Bus Stop</DialogTitle>
          <DialogDescription>Add a name for the bus stop</DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2">
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="busStopLabel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bus Stop Label</FormLabel>
                    <FormControl>
                      <Input
                        id="busStopLabel"
                        placeholder="Bus Stop Name"
                        {...field}
                        className="h-[2.6rem]"
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.busStopLabel?.message ||
                        (isBusStopExists && "Label already taken")}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="busStopType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bus Stop Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        defaultValue={BusStopType.BusStop}
                      >
                        <SelectTrigger className="py-5">
                          <span>{busStopType.replace(/_/g, " ")}</span>
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(BusStopType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.replace(/_/g, " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.busStopType?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                size="lg"
                className="mt-2"
                disabled={isLoading}
              >
                {isLoading && <Spinner className="text-background me-2" />}
                <span>{isLoading ? "Inserting..." : "Add Bus Stop"}</span>
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default AddStop;
