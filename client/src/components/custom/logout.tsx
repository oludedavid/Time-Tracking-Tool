"use client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import secureLocalStorage from "react-secure-storage";

const LogoutButton = ({ className }: { className: string }) => {
  const router = useRouter();

  const handleLogout = () => {
    secureLocalStorage.clear();
    router.push("/");
  };

  return (
    <Button
      onClick={handleLogout}
      className={`bg-red-100 shadow-none border-none hover:text-white text-gray-700 p-2 rounded flex gap-4 items-center justify-center text-md ${className}`}
    >
      <LogOut />
      Logout
    </Button>
  );
};

export default LogoutButton;
