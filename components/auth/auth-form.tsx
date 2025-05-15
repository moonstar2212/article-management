"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UserRole } from "@/types";
import { useAuth } from "@/context";
import { useToast } from "@/hooks/use-toast";
import { dummyUsers } from "@/utils";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/loading-spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Login form schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

// Register form schema
const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["user", "admin"] as const),
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

type AuthFormProps = {
  type: "login" | "register";
};

export function AuthForm({ type }: AuthFormProps) {
  const { login, register } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Login form
  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
    },
  });

  // Handle login
  const handleLogin = async (values: LoginValues) => {
    setIsLoading(true);
    try {
      await login(values.email, values.password);
      toast({
        title: "Success",
        description: "You have been logged in successfully",
      });
    } catch (error) {
      console.error("Login error:", error);

      // Fallback to dummy data when API fails
      // Try to check if this email was registered as admin previously
      const storedUserData = localStorage.getItem(`demo_user_${values.email}`);
      let role = "user";

      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          role = userData.role;
        } catch (e) {
          // Fallback to email check if localStorage parsing fails
          role = values.email.includes("admin") ? "admin" : "user";
        }
      } else {
        // Fallback to email check if no localStorage data
        role = values.email.includes("admin") ? "admin" : "user";
      }

      const dummyUser = dummyUsers.find((user) => user.role === role);

      if (dummyUser) {
        // Set token and user in cookies
        Cookies.set(
          "token",
          dummyUser.token || `dummy-${dummyUser.role}-token`,
          { expires: 7 }
        );

        const userData = {
          ...dummyUser,
          email: values.email,
        };

        Cookies.set("user", JSON.stringify(userData), { expires: 7 });

        // Store user data in localStorage for future logins
        localStorage.setItem(
          `demo_user_${values.email}`,
          JSON.stringify({
            email: values.email,
            role: dummyUser.role,
          })
        );

        toast({
          title: "Success",
          description: `Demo login successful as ${dummyUser.role}`,
        });

        // Redirect based on role
        if (dummyUser.role === "admin") {
          router.push("/admin/articles");
        } else {
          router.push("/user/articles");
        }
        return;
      }

      toast({
        title: "Error",
        description: "Failed to login. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle register
  const handleRegister = async (values: RegisterValues) => {
    setIsLoading(true);
    try {
      await register(
        values.name,
        values.email,
        values.password,
        values.role as UserRole
      );
      toast({
        title: "Success",
        description: "Your account has been created successfully",
      });
    } catch (error) {
      console.error("Registration error:", error);

      // Fallback to dummy data when API fails
      if (values.role === "admin") {
        // Use admin dummy data
        const adminUser = dummyUsers.find((user) => user.role === "admin");
        if (adminUser) {
          Cookies.set("token", adminUser.token || "dummy-admin-token", {
            expires: 7,
          });

          const userData = {
            ...adminUser,
            name: values.name,
            email: values.email,
          };

          Cookies.set("user", JSON.stringify(userData), { expires: 7 });

          // Store user role in localStorage for future logins
          localStorage.setItem(
            `demo_user_${values.email}`,
            JSON.stringify({
              email: values.email,
              name: values.name,
              role: "admin",
            })
          );

          toast({
            title: "Success",
            description: "Demo account created with admin role",
          });

          router.push("/admin/articles");
          return;
        }
      } else {
        // Use regular user dummy data
        const regularUser = dummyUsers.find((user) => user.role === "user");
        if (regularUser) {
          Cookies.set("token", regularUser.token || "dummy-user-token", {
            expires: 7,
          });

          const userData = {
            ...regularUser,
            name: values.name,
            email: values.email,
          };

          Cookies.set("user", JSON.stringify(userData), { expires: 7 });

          // Store user role in localStorage for future logins
          localStorage.setItem(
            `demo_user_${values.email}`,
            JSON.stringify({
              email: values.email,
              name: values.name,
              role: "user",
            })
          );

          toast({
            title: "Success",
            description: "Demo account created with user role",
          });

          router.push("/user/articles");
          return;
        }
      }

      // If fallback failed
      toast({
        title: "Error",
        description: "Failed to register. Using demo data failed.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If login form
  if (type === "login") {
    return (
      <Form {...loginForm}>
        <form
          onSubmit={loginForm.handleSubmit(handleLogin)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <FormField
              control={loginForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/90">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Enter Your Email"
                        className="pl-10 h-10 bg-background/50 border-input/50 focus-visible:ring-offset-0 focus-visible:ring-primary/30"
                        {...field}
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="absolute left-3 top-2.5 text-muted-foreground h-5 w-5"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/90">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="password"
                        placeholder="Enter Your Password"
                        className="pl-10 h-10 bg-background/50 border-input/50 focus-visible:ring-offset-0 focus-visible:ring-primary/30"
                        {...field}
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="absolute left-3 top-2.5 text-muted-foreground h-5 w-5"
                      >
                        <rect
                          width="18"
                          height="11"
                          x="3"
                          y="11"
                          rx="2"
                          ry="2"
                        />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            variant="gradient"
            className="w-full h-10"
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner size="small" className="mr-2" />
            ) : null}
            Sign In
          </Button>
        </form>
      </Form>
    );
  }

  // If register form
  return (
    <Form {...registerForm}>
      <form
        onSubmit={registerForm.handleSubmit(handleRegister)}
        className="space-y-6"
      >
        <div className="space-y-4">
          <FormField
            control={registerForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/90">Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="John Doe"
                      className="pl-10 h-10 bg-background/50 border-input/50 focus-visible:ring-offset-0 focus-visible:ring-primary/30"
                      {...field}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="absolute left-3 top-2.5 text-muted-foreground h-5 w-5"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={registerForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/90">Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="example@email.com"
                      className="pl-10 h-10 bg-background/50 border-input/50 focus-visible:ring-offset-0 focus-visible:ring-primary/30"
                      {...field}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="absolute left-3 top-2.5 text-muted-foreground h-5 w-5"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={registerForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/90">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="password"
                      placeholder="******"
                      className="pl-10 h-10 bg-background/50 border-input/50 focus-visible:ring-offset-0 focus-visible:ring-primary/30"
                      {...field}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="absolute left-3 top-2.5 text-muted-foreground h-5 w-5"
                    >
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={registerForm.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/90">Role</FormLabel>
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="absolute left-3 top-2.5 text-muted-foreground h-5 w-5 z-10 pointer-events-none"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="pl-10 h-10 bg-background/50 border-input/50">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          variant="gradient"
          className="w-full h-10"
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner size="small" className="mr-2" /> : null}
          Create Account
        </Button>
      </form>
    </Form>
  );
}
