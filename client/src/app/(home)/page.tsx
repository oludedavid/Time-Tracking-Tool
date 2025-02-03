"use client";
import Register from "@/components/custom/register";
import Login from "@/components/custom/login";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import HomeStyles from "./home.module.css";

export default function Home() {
  return (
    <div
      className={`${HomeStyles.home_background} flex  justify-center min-h-screen p-8`}
    >
      <Tabs defaultValue="register" className="w-full h-72 max-w-[550px]">
        <TabsList className="grid w-full grid-cols-2 bg-transparent gap-2">
          <TabsTrigger
            value="register"
            className="data-[state=active]:bg-white/20 data-[state=active]:text-white bg-transparent hover:bg-white/10 transition-all rounded-t-lg border-b-2 data-[state=active]:border-primary border-transparent"
          >
            Register
          </TabsTrigger>
          <TabsTrigger
            value="login"
            className="data-[state=active]:bg-white/20 data-[state=active]:text-white bg-transparent hover:bg-white/10 transition-all rounded-t-lg border-b-2 data-[state=active]:border-primary border-transparent"
          >
            Login
          </TabsTrigger>
        </TabsList>

        <TabsContent value="register">
          <Card className="backdrop-blur-sm bg-white/10 border-white/20 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl text-white">
                Join Logify Today ✨
              </CardTitle>
              <CardDescription className="text-white/80">
                Create your account and unlock a world of possibilities!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Register />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="login">
          <Card className="backdrop-blur-sm bg-white/10 border-white/20 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl text-white">
                Welcome Back! 🔑
              </CardTitle>
              <CardDescription className="text-white/80">
                Secure access to your personalized dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Login />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
