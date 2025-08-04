"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "@/lib/axiosInstance"; // Update the path if needed
import { useState } from "react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";

// ✅ Zod schemas
const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["student", "instructor"]).optional(), // Optional for signup
});

const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export function AuthTabs() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // ✅ Zustand store for user
  const { setUser } = useUserStore();

  // Sign Up Form
  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  // Log In Form
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // ✅ Register Handler
  const onRegister = async (data: any) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/user/register", {
        ...data,
        role: "student",
      });

      toast.success("Account created successfully!");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Something went wrong during signup"
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Login Handler
  const onLogin = async (data: any) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/user/login", data);
      // Set user in Zustand store
      setUser(res.data.user);

      toast.success("Logged in successfully!");
      // optionally redirect
      router.push("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex w-full max-w-sm flex-col gap-6'>
      <Tabs defaultValue='signup'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='signup'>Sign Up</TabsTrigger>
          <TabsTrigger value='login'>Log In</TabsTrigger>
        </TabsList>

        {/* Sign Up */}
        <TabsContent value='signup'>
          <Card>
            <CardHeader>
              <CardTitle>Create an Account</CardTitle>
              <CardDescription>
                Enter your details to create a new account.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSignupSubmit(onRegister)}>
              <CardContent className='grid gap-4'>
                <div className='grid gap-2'>
                  <Label htmlFor='signup-name'>Name</Label>
                  <Input
                    id='signup-name'
                    placeholder='Your full name'
                    {...registerSignup("name")}
                  />
                  {signupErrors.name && (
                    <p className='text-sm text-red-500'>
                      {signupErrors.name.message}
                    </p>
                  )}
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='signup-email'>Email</Label>
                  <Input
                    id='signup-email'
                    type='email'
                    placeholder='you@example.com'
                    {...registerSignup("email")}
                  />
                  {signupErrors.email && (
                    <p className='text-sm text-red-500'>
                      {signupErrors.email.message}
                    </p>
                  )}
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='signup-password'>Password</Label>
                  <Input
                    id='signup-password'
                    type='password'
                    placeholder='••••••••'
                    {...registerSignup("password")}
                  />
                  {signupErrors.password && (
                    <p className='text-sm text-red-500'>
                      {signupErrors.password.message}
                    </p>
                  )}
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='signup-role'>Role</Label>
                  <select
                    id='signup-role'
                    {...registerSignup("role")}
                    className='w-full p-2 border rounded'
                  >
                    <option value='student'>Student</option>
                    <option value='instructor'>Instructor</option>
                  </select>
                  {signupErrors.role && (
                    <p className='text-sm text-red-500'>
                      {signupErrors.role.message}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className='w-full mt-4'
                  type='submit'
                  disabled={loading}
                >
                  {loading ? "Signing Up..." : "Sign Up"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Log In */}
        <TabsContent value='login'>
          <Card>
            <CardHeader>
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>
                Enter your credentials to access your account.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLoginSubmit(onLogin)}>
              <CardContent className='grid gap-4'>
                <div className='grid gap-2'>
                  <Label htmlFor='login-email'>Email</Label>
                  <Input
                    id='login-email'
                    type='email'
                    placeholder='you@example.com'
                    {...registerLogin("email")}
                  />
                  {loginErrors.email && (
                    <p className='text-sm text-red-500'>
                      {loginErrors.email.message}
                    </p>
                  )}
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='login-password'>Password</Label>
                  <Input
                    id='login-password'
                    type='password'
                    placeholder='••••••••'
                    {...registerLogin("password")}
                  />
                  {loginErrors.password && (
                    <p className='text-sm text-red-500'>
                      {loginErrors.password.message}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className='w-full mt-4'
                  type='submit'
                  disabled={loading}
                >
                  {loading ? "Logging In..." : "Log In"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
