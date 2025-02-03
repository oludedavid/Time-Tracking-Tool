"use client";
import axios from "axios";
import { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<
    "loading" | "verified" | "error" | "invalid"
  >("loading");
  const { toast } = useToast();

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/users/verify-email",
          {
            params: { token },
          }
        );

        if (response.data.success) {
          setStatus("verified");
          toast({
            title: "Email Verified!",
            description: "Your email has been successfully verified.",
          });

          setTimeout(() => router.push("/"), 2000);
        } else {
          setStatus("error");
        }
      } catch (error) {
        const errorMessage =
          error instanceof AxiosError
            ? error.response?.data?.message || "Verification failed"
            : "An unexpected error occurred";

        setStatus("error");
        toast({
          title: "Verification Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };

    verifyEmail();
  }, [token, router, toast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="max-w-md space-y-4">
        {status === "loading" && (
          <>
            <h1 className="text-2xl font-bold">Verifying Your Email</h1>
            <p className="text-gray-600">
              Please wait while we verify your email...
            </p>
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
          </>
        )}

        {status === "verified" && (
          <>
            <h1 className="text-2xl font-bold text-green-500">
              Email Verified! 🎉
            </h1>
            <p className="text-gray-600">Redirecting to your dashboard...</p>
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold text-red-500">
              Verification Failed
            </h1>
            <p className="text-gray-600">
              Something went wrong. Please try again later.
            </p>
            <Button onClick={() => router.push("/")}>Return to Home</Button>
          </>
        )}

        {status === "invalid" && (
          <>
            <h1 className="text-2xl font-bold text-red-500">
              Invalid Verification Link
            </h1>
            <p className="text-gray-600">
              The verification link is invalid or expired.
            </p>
            <Button onClick={() => router.push("/")}>Return to Home</Button>
          </>
        )}
      </div>
    </div>
  );
}
