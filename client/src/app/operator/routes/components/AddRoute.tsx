import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

const schema = z.object({
  routeName: z.string().min(1, "Route name is required"),
});

type FormData = {
  routeName: string;
};

// Main Component
const AddStop = ({
  isOpen,
  setIsOpen,
  selectedStops,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedStops: { location: { coordinates: [number, number] } }[];
}) => {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const [isRouteExists, setIsRouteExists] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsRouteExists(false);
    setIsLoading(true);
    try {
      const routeData = {
        label: data.routeName,
        path: selectedStops.map((stop) => stop.location.coordinates),
        stops: selectedStops.map((stop:any) => stop.stop_id),
      };

      const res = await axios.put("/api/operator/route/add", routeData);
      if (res.data.success) {
        toast("Success", {
          description: "Route added successfully",
          action: {
            label: "Close",
          },
          position: "top-center",
          duration: 6000,
        });
      }
      setIsOpen(false);
    } catch (e: any) {
      console.log(e);
      if (e?.response?.data?.data?.code == 23505) {
        setIsRouteExists(true);
        console.log("working");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Route</DialogTitle>
          <DialogDescription>Add a label for the route</DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2">
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="routeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bus route label</FormLabel>
                    <FormControl>
                      <Input
                        id="routeName"
                        placeholder="Bus Route Name"
                        {...field}
                        className="h-[2.6rem]"
                      />
                    </FormControl>
                    <FormMessage>
                      {isRouteExists && "Label already used"}
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
                <span>{isLoading ? "Inserting..." : "Add Route"}</span>
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default AddStop;
