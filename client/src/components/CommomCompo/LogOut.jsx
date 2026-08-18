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

      toast.success(response?.data?.message || "User logged out");

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
    <button
      type="button"
      onClick={() => handleLogoutMutation.mutate()}
      disabled={handleLogoutMutation.isPending}
      className="flex items-center justify-center gap-1 rounded-lg bg-red-400/20 px-2 py-1.5 text-xs text-red-300 transition hover:bg-red-500 hover:text-white disabled:pointer-events-none disabled:opacity-70 sm:gap-2 sm:rounded-xl sm:px-3 sm:py-2 sm:text-sm"
    >
      {handleLogoutMutation.isPending ? (
        <>
          <div
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-e-transparent"
            role="status"
          />
          <span>Logging out...</span>
        </>
      ) : (
        <>
          <LucideLogOut size={16} />
        </>
      )}
    </button>
  );
};

export default React.memo(LogOut)