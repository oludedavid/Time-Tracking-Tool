"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { AxiosError } from "axios";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const passwordSchema = z.string().trim();

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .trim()
    .toLowerCase()
    .nonempty({ message: "Your email is required" }),
  password: passwordSchema,
});
type TLoginUser = z.infer<typeof formSchema>;
const logUser = async (user: TLoginUser) => {
  try {
    const { data } = await axios.post(
      "http://localhost:5001/api/users/login",
      user
    );
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Error Logging user:",
        error.response?.data || error.message
      );
      throw new Error(error.response?.data?.message || "Failed to Log user");
    } else {
      console.error("Unexpected error:", error);
      throw new Error("Something went wrong");
    }
  }
};
export default function Login() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const data = await logUser(values);
      if (data.success) {
        toast({
          title: "🎉 Login Successful!",
          description: "You have successfully Logged In",
          className: "bg-green-500/20 border-green-500",
        });
      }
    } catch (error) {
      toast({
        title: "⚠️ Registration Failed",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 text-white"
      >
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

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
