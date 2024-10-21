"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
import { BusFormSchema as FormSchema } from "@/schema/form";
import useNewBusAddedStore from "@/store/useNewBusAddedStore";

const Component = ({
  state: [open, setOpen],
}: {
  state: [boolean, (_: boolean) => void];
}) => {
  const { setBusAdded }: any = useNewBusAddedStore();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setBusAdded(true);
    setOpen(false);
    try {
      await axios.put("/api/operator/bus/add", data);
    } catch (err) {
      console.log(err);
    }
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { setValue } = form;

  const { width }: { width: number } = useWindowSize(100);
  const smallScreen: number = 640;

  return (
    <div className="">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild></SheetTrigger>
        <SheetContent
          side={width < smallScreen ? "bottom" : "right"}
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
