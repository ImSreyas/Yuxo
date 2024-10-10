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
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [loginErr, setLoginErr] = useState<LoginErr>({
    emailErr: null,
    passwordErr: null,
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async ({ email, password }: z.infer<typeof FormSchema>) => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/find/admin", { email });
      if (data.success) {
        const { data } = await axios.post("/api/auth/login/admin", {
          email,
          password,
        });
        if (data.success) {
          router.push("/admin");
        } else {
          setLoginErr({ emailErr: null, passwordErr: "Invalid password" });
        }
      } else {
        setLoginErr({ emailErr: "User not found", passwordErr: null });
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center sm:px-20 sm:py-14 rounded-xl sm:border w-[78%] sm:w-fit">
      <div className="mx-auto grid gap-6 w-full sm:w-[350px]">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Admin Login</h1>
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
              <Button type="submit" className="w-full mt-2" disabled={loading}>
                {loading ? <Spinner className="text-background mx-2" /> : null}
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
          If you are a User or Operator?{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
