"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, PanelRightClose } from "lucide-react";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import useWindowSize from "@/hooks/useWindowSize";
import ColorPicker from "./ColorPicker";
import axios from "axios";
import { AdminBusFormSchema as FormSchema } from "@/schema/form";
import useNewBusAddedStore from "@/store/useNewBusAddedStore";

const Component = ({
  state: [open, setOpen],
}: {
  state: [boolean, (_: boolean) => void];
}) => {
  const [loading, setLoading] = useState(false);
  const [isOperatorIdNotValid, setIsOperatorIdNotValid] = useState(false);
  const { setBusAdded }: any = useNewBusAddedStore();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const { data: operatorData } = await axios.post(
        "/api/admin/operator/search",
        { operator_id: data.operator_id }
      );
      if (operatorData?.success) {
        // console.log(data);
        const { data: responseData } = await axios.put(
          "/api/admin/bus/add",
          data
        );
        if (responseData?.success) {
          setBusAdded(true);
          setOpen(false);
          toast("Successful", {
            description: "New bus added successfully",
            action: {
              label: "Close",
            },
            position: "top-center",
            duration: 6000,
          });
        } else {
          toast("Something went wrong", {
            description: "Please check your internet connection",
            action: {
              label: "Close",
            },
            position: "top-center",
          });
        }
      } else {
        setIsOperatorIdNotValid(true);

        toast("Invalid operator ID", {
          description: "Please enter a valid operator ID",
          action: {
            label: "Close",
          },
          position: "top-center",
        });
      }
    } catch (error) {
      console.log(error);
      toast("Something went wrong", {
        description: "Check your internet connection",
        action: {
          label: "Close",
        },
        position: "top-center",
      });
    }
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

  const { setValue } = form;

  const { width }: { width: number } = useWindowSize(100);
  const smallScreen: number = 640;

  return (
    <div className="">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side={width < smallScreen ? "bottom" : "right"}
          onPointerDownOutside={(e) => e.preventDefault()}
          className="w-full h-[90%] sm:h-full py-16 px-12 md:max-w-md lg:max-w-lg lg:px-14 overflow-y-scroll"
        >
          <SheetHeader>
            <SheetTitle>Add Bus</SheetTitle>
            <SheetDescription>Add the details of the bus</SheetDescription>
          </SheetHeader>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6">
              <div className="grid gap-2">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="operator_id"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Operator ID</FormLabel>
                        <FormControl>
                          <Input
                            id="type"
                            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage>
                          {isOperatorIdNotValid && "Invalid operator ID"}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bus name</FormLabel>
                        <FormControl>
                          <Input id="name" placeholder="AVE MARIA" {...field} />
                        </FormControl>
                        <FormMessage></FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Bus type</FormLabel>
                          <FormControl>
                            <Input
                              id="type"
                              placeholder="SF"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription></FormDescription>
                          <FormMessage></FormMessage>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <FormField
                      control={form.control}
                      name="reg"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Plate number</FormLabel>
                          <FormControl>
                            <Input
                              id="reg"
                              placeholder="KL XX A XXXX"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription></FormDescription>
                          <FormMessage></FormMessage>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Color</FormLabel>
                          <FormControl>
                            <ColorPicker setValue={setValue} />
                            {/* <Input
                              id="color"
                              placeholder="blue"
                              type="text"
                              {...field}
                            /> */}
                          </FormControl>
                          <FormDescription></FormDescription>
                          <FormMessage></FormMessage>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <FormField
                      control={form.control}
                      name="bus_capacity"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Bus capacity</FormLabel>
                          <FormControl>
                            <Input
                              id="bus-capacity"
                              placeholder="40"
                              type="number"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription></FormDescription>
                          <FormMessage></FormMessage>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid gap-2"></div>
                <Button type="submit" size="lg">
                  Add Bus
                </Button>
              </div>
            </form>
          </FormProvider>

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
    </div>
  );
};

export default Component;
