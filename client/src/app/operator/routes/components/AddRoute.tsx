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
  busStopLabel: z.string().min(1, "Route name is required"),
});

type FormData = {
  routeName: string;
};

// Fun component
const AddStop = ({ isOpen, setIsOpen }: { isOpen: any; setIsOpen: any }) => {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const [isRouteExists, setIsRouteExists] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    // console.log(data.busStopLabel);
    setIsRouteExists(false);
    setIsLoading(true);
    try {
      const routeData: any = {
        label: data.routeName,
        path: [],
      };
      const res = await axios.put("", routeData);
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
    } catch (e: any) {
      console.log(e.response.data.data.code);
      if (e?.response?.data?.data?.code == 23505) {
        setIsRouteExists(true);
      }
    }
    setIsLoading(false);
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
                        id="busStopLabel"
                        placeholder="Bus Stop Name"
                        {...field}
                        className="h-[2.6rem]"
                      />
                    </FormControl>
                    <FormMessage>
                      {isRouteExists && "Label already taken"}
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
