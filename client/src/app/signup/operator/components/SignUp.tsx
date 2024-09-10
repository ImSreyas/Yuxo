"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import useAuth from "@/app/hooks/useAuth";
import { Checkbox } from "@/components/ui/checkbox";
import { OperatorFormSchema } from "@/schema/form";

const SignUp = () => {
  const { operatorSignUp, loading, error: authError } = useAuth();

  const form = useForm<z.infer<typeof OperatorFormSchema>>({
    resolver: zodResolver(OperatorFormSchema),
    defaultValues: {
      email: "",
      name: "",
      phone: "",
      place: "",
      permit_no: "",
      is_ksrtc_operator: false,
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof OperatorFormSchema>) => {
    // console.log(data)
    const operator = await operatorSignUp(data);
  };

  return (
    <div className="overflow-y-scroll grid justify-center py-16 lg:col-span-2 no-scrollbar">
      <div className="mx-auto grid w-[350px] gap-6">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Operator Sign Up</h1>
          <p className="text-balance text-muted-foreground text-sm">
            Enter your email and password to sign up
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          // type="email"
                          placeholder="demo@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>
                        {authError ? "Email already registered" : null}
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
                    <FormItem className="w-full">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input id="name" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input id="phone" type="text" {...field} />
                      </FormControl>
                      <FormDescription>
                        Phone number must contain 10 numbers
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="place"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Place</FormLabel>
                      <FormControl>
                        <Input id="place" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="permit_no"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Permit number</FormLabel>
                      <FormControl>
                        <Input id="permit_no" type="text" {...field} />
                      </FormControl>
                      <FormDescription>
                        Should be between 15 and 20 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input id="password" type="password" {...field} />
                      </FormControl>
                      <FormDescription>
                        Password must be at least 6 characters long
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl>
                        <Input
                          id="confirm_password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2 mt-2">
                <FormField
                  control={form.control}
                  name="is_ksrtc_operator"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <div className="ms-1 flex items-center space-x-2">
                          <Checkbox
                            id="is_ksrtc_operator"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <label
                            htmlFor="is_ksrtc_operator"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            KSRTC Operator
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full mt-1">
                Sign Up
              </Button>
              {/* <div className="relative">
                <Separator className="my-4" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card text-muted-foreground px-4 w-fit text-xs ">
                  OR CONTINUE WITH
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Google
              </Button> */}
            </div>
          </form>
        </Form>
        <div>
          <div className="mt-1 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
