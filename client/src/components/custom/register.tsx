"use client";
import axios from "axios";
import { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const passwordSchema = z
  .string()
  .trim()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(100, { message: "Password cannot exceed 100 characters" })
  .refine((password) => /[A-Z]/.test(password), {
    message: "Password must contain at least one uppercase letter",
  })
  .refine((password) => /[a-z]/.test(password), {
    message: "Password must contain at least one lowercase letter",
  })
  .refine((password) => /[0-9]/.test(password), {
    message: "Password must contain at least one number",
  });

const formSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, { message: "Full name must be at least 2 characters" })
      .max(50, { message: "Full name cannot exceed 50 characters" })
      .nonempty({ message: "Your name is required" }),
    email: z
      .string()
      .email({ message: "Invalid email address" })
      .trim()
      .toLowerCase()
      .nonempty({ message: "Your email is required" }),
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(100),
    role: z.enum(["freelancer", "project_manager", "admin"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type TAddUser = z.infer<typeof formSchema>;

const addUser = async (user: TAddUser) => {
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/register`,
      user
    );
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error registering user:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to register user"
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("Something went wrong");
    }
  }
};

export default function Register() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "freelancer",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const data = await addUser(values);
      if (data.success) {
        toast({
          title: "🎉 Registration Successful!",
          description:
            "Your account has been created. Please verify your email to login",
          className: "bg-green-500/20 border-green-500 text-white",
        });
      }
      form.reset();
    } catch (error) {
      toast({
        title: "⚠️ Registration Failed",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 text-white "
      >
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Full Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Max Müller"
                  {...field}
                  className="bg-white/10 border-white/20 hover:bg-white/20 focus:ring-2 focus:ring-primary/50"
                />
              </FormControl>
              <FormMessage className="text-xs text-red-300" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="MaxMüller@jtmail.com"
                  {...field}
                  className="bg-white/10 border-white/20 hover:bg-white/20 focus:ring-2 focus:ring-primary/50"
                />
              </FormControl>
              <FormMessage className="text-xs text-red-300" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Password"
                  {...field}
                  className="bg-white/10 border-white/20 hover:bg-white/20 focus:ring-2 focus:ring-primary/50"
                />
              </FormControl>
              <FormMessage className="text-xs text-red-300" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Confirm Password
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  {...field}
                  className="bg-white/10 border-white/20 hover:bg-white/20 focus:ring-2 focus:ring-primary/50"
                />
              </FormControl>
              <FormMessage className="text-xs text-red-300" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Role</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white/10 border-white/20 hover:bg-white/20 focus:ring-2 focus:ring-primary/50">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="freelancer">Freelancer</SelectItem>
                  <SelectItem
                    value="project_manager"
                    className="hover:bg-white/10"
                  >
                    <span className="capitalize">Project Manager</span>
                  </SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-xs text-red-300" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center"
        >
          {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}{" "}
          Submit
        </Button>
      </form>
    </Form>
  );
}
