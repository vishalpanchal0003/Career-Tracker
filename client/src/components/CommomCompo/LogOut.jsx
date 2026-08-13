import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useNavigate } from "react-router-dom";
import { logout } from "../../api/userApiInstance";
import { toast } from "sonner";
import { LucideLogOut } from "lucide-react";
import React from "react";

const LogOut = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogoutMutation = useMutation({
    mutationFn: logout,

    onSuccess: (response) => {
      localStorage.removeItem("accessToken");
      queryClient.clear();

      toast.success(response?.data?.message ||"User logged out");

      navigate("/login", {
        replace: true,
      });
    },

    onError: (error) => {
      localStorage.removeItem("accessToken");
      queryClient.clear();
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Logout failed"
      );

      navigate("/login", {
        replace: true,
      });
    },
  });

  return (
    <div>
      <button
        type="button"
        onClick={() => handleLogoutMutation.mutate()}
        className="flex items-center justify-center gap-1 rounded-lg bg-red-400/20 px-2 py-1.5 text-xs text-red-300 transition hover:bg-red-500 hover:text-white sm:gap-2 sm:rounded-xl sm:px-3 sm:py-2 sm:text-sm"
      >
        <LucideLogOut size={16} className="sm:w-[18px] sm:h-[18px]" />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </div>
  );
};

export default React.memo(LogOut)