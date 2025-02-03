/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import secureLocalStorage from "react-secure-storage";

interface AuthTokenPayload {
  id: string;
  role: Role;
  email: string;
}

type Role = "admin" | "freelancer" | "project_manager";

interface RouteGuardOptions {
  redirectOnUnauthorized?: string;
  fallbackRole?: Role;
  strictRoleCheck?: boolean;
}

const RouteGuard = (
  WrappedComponent: React.ComponentType<any>,
  allowedRoles: Role[],
  options: RouteGuardOptions = {}
) => {
  const {
    redirectOnUnauthorized = "/forbidden",
    fallbackRole = null,
    strictRoleCheck = true,
  } = options;

  const GuardComponent = (props: any) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<Role | null>(null);

    const getAuthToken = () => {
      if (typeof window !== "undefined") {
        return secureLocalStorage.getItem("TOKEN");
      }
      return null;
    };

    const clearAuthData = () => {
      if (typeof window !== "undefined") {
        secureLocalStorage.clear();
      }
    };

    useEffect(() => {
      const verifyAuth = async () => {
        setLoading(true);
        const token = getAuthToken();

        if (!token) {
          redirectToLogin();
          return;
        }

        try {
          const { data } = await axios.get<{
            success: boolean;
            user: AuthTokenPayload;
          }>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/login/decode-login-token`,
            {
              headers: { Authorization: `Bearer ${token}` },
              timeout: 5000,
            }
          );

          // Enhanced token validation
          if (!data?.success || !validateTokenPayload(data.user)) {
            throw new Error("Invalid token");
          }

          // Role authorization check with flexibility
          const authorized = checkRoleAuthorization(data.user.role);

          if (!authorized) {
            router.push("/forbidden");
            return;
          }

          setUserRole(data.user.role);
          setIsVerified(true);
        } catch (error) {
          handleAuthError(error);
        } finally {
          setLoading(false);
        }
      };

      verifyAuth();
    }, [router, pathname]);

    const validateTokenPayload = (user: AuthTokenPayload): boolean => {
      if (!user?.id || !user?.role) return false;

      return true;
    };

    const checkRoleAuthorization = (role: Role): boolean => {
      if (!strictRoleCheck && fallbackRole) {
        return allowedRoles.includes(fallbackRole);
      }

      return allowedRoles.includes(role);
    };

    const redirectToLogin = () => {
      router.push(`${redirectOnUnauthorized}`);
    };

    const handleAuthError = (error: any) => {
      console.error("Auth verification error:", error);
      clearAuthData();

      if (axios.isAxiosError(error)) {
        switch (error.response?.status) {
          case 403:
            router.push("/forbidden");
            break;
          case 401:
            redirectToLogin();
            break;
          default:
            redirectToLogin();
        }
      } else {
        redirectToLogin();
      }
    };

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      );
    }

    if (!isVerified) return null;

    return <WrappedComponent {...props} userRole={userRole} />;
  };

  GuardComponent.displayName = `RouteGuard(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return GuardComponent;
};

export default RouteGuard;
