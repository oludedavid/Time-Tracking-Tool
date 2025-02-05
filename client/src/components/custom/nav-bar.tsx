"use client";
import { format } from "date-fns";
import { TUser } from "@/types";
import { UserCircle2, Clock } from "lucide-react";
import { useState, useEffect } from "react";

function DateDisplay() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!currentTime) return null;

  return (
    <div className="text-[#780206] font-medium flex items-center gap-2">
      <Clock className="w-5 h-5" />
      <span>{format(currentTime, "EEEE, MMMM do yyyy 'at' HH:mm")}</span>
    </div>
  );
}

export default function NavBar({ user }: { user: TUser }) {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-3 border-b border-[#061161]/20">
      <DateDisplay />

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 group hover:text-[#780206] transition-colors">
          <UserCircle2 className="w-6 h-6 text-[#061161] group-hover:text-[#780206]" />
          <h3 className="text-[#061161] text-lg font-semibold group-hover:text-[#780206]">
            {user?.name}
          </h3>
        </div>
      </div>
    </nav>
  );
}
