"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import useAuth from "@/app/hooks/useAuth";
import { useState } from "react";
import { type authCheckResponse } from "@/lib/types/auth";
import { redirect } from "next/dist/server/api-utils";

const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string({ message: "Password should not be empty" }),
});

type LoginErr = {
  emailErr: string | null;
  passwordErr: string | null;
};

// Main component
const Login = () => {
  const [loginErr, setLoginErr] = useState<LoginErr>({
    emailErr: null,
    passwordErr: null,
  });
  const { login } = useAuth();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async ({ email, password }: z.infer<typeof FormSchema>) => {
    try {
      const response = await axios.post("/api/auth/find", {
        email,
      });
      const data: authCheckResponse = response.data;

      if (data.success) {
        let redirectPath = ""
        switch(data.userRole) {
          case "user":
            redirectPath = "/"
            break;
          case "operator":
            redirectPath = "/operator"
            break;
          default:
            redirectPath = "/"
        }

        const { error } = await login(email, password, redirectPath);
        if (error) {
          setLoginErr({ emailErr: null, passwordErr: "Wrong password" });
        }
      } else {
        setLoginErr({ emailErr: "User not found", passwordErr: null });
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center py-24 lg:col-span-2">
      <div className="mx-auto grid w-[350px] gap-6">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-balance text-muted-foreground text-sm">
            Enter your email and password to login
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
                      <FormMessage>{loginErr.emailErr}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Link
                          href=""
                          className="ml-auto inline-block text-sm underline"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input id="password" type="password" {...field} />
                      </FormControl>
                      <FormMessage>{loginErr.passwordErr}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full mt-1">
                Login
              </Button>
              <div className="relative">
                <Separator className="my-4" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card text-muted-foreground px-4 w-fit text-xs ">
                  OR
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </div>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup/user" className="underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
