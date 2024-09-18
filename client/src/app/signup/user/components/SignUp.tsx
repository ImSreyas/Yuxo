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
import TermsAndConditions from "../../components/TermsAndConditions";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";

const FormSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(6, { message: "Invalid password" }),
    confirm_password: z.string({ message: "Please confirm your password." }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  });

// Component
const SignUp = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { userSignUp, error: authError } = useAuth();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    const user = await userSignUp(data.email, data.password);
    setLoading(false);
    // console.log(user);
  };

  return (
    <div className="items-center lg:overflow-y-auto grid justify-center py-16 lg:col-span-2 relative">
      <div className="mx-auto grid w-[350px] gap-6">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Sign Up</h1>
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
                    <FormItem>
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
                <div className="flex items-center">
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
                        <FormMessage></FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full mt-1" disabled={loading}>
                {loading ? <Spinner className="text-background mx-2" /> : null}
                Sign Up
              </Button>
              <div className="relative">
                <Separator className="my-4" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card text-muted-foreground px-4 w-fit text-xs ">
                  OR CONTINUE WITH
                </div>
              </div>
              <Button type="button" variant="outline" className="w-full">
                Google
              </Button>
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
          <div className="mt-1 text-center text-sm">
            Operators?{" "}
            <Link href="/signup/operator" className="underline">
              sign up
            </Link>
          </div>
          <TermsAndConditions />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
