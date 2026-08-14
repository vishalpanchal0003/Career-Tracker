import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword, sendOtp } from "../api/userApiInstance";
import { toast } from "sonner";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const sendOTPMutation = useMutation({
    mutationFn: (userData) => sendOtp(userData),

    onSuccess: (response) => {
      toast.success(
        response?.data?.message || "OTP sent successfully"
      );

      setStep(2);
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
        "Server is busy, please try again"
      );
    },
  });

  const resetUserPassword = useMutation({
    mutationFn: (userData) => resetPassword(userData),

    onSuccess: (response) => {
      toast.success(
        response?.data?.message ||
        "Password changed successfully"
      );

      navigate("/login");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
        "Invalid or expired OTP"
      );
    },
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendOtp = (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    sendOTPMutation.mutate({
      email: formData.email.trim(),
    });
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (
      !formData.email.trim() ||
      !formData.otp.trim() ||
      !formData.newPassword.trim() ||
      !formData.confirmPassword.trim()
    ) {
      toast.error("All fields are required");
      return;
    }

    if (
      formData.newPassword !== formData.confirmPassword
    ) {
      toast.error(
        "New password and confirm password should be same"
      );
      return;
    }

    resetUserPassword.mutate(formData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white/30 px-4 text-black ">
      <div className="w-full max-w-md rounded-2xl border border-gray-50   p-6 shadow-xl sm:p-8">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center  rounded-full bg-blue-50 text-3xl">
          🔐
        </div>

        {step === 1 && (
          <>
            <h1 className="text-center text-2xl font-bold text-gray-800">
              Forgot Password?
            </h1>

            <p className="mt-3 text-center text-sm leading-6 text-gray-500">
              Enter your registered email address and we will
              send you an OTP to reset your password.
            </p>

            <form
              onSubmit={handleSendOtp}
              className="mt-7"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleOnChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={sendOTPMutation.isPending}
                className="mt-5 h-12 w-full rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sendOTPMutation.isPending
                  ? "Sending..."
                  : "Send OTP"}
              </button>
            </form>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-5 block w-full text-center text-sm text-black hover:underline"
            >
              ← Back to Login
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-center text-2xl font-bold text-gray-800">
              Reset Password
            </h1>

            <p className="mt-3 text-center text-sm leading-6 text-gray-500">
              Enter the OTP sent to your email and create a new
              password.
            </p>

            <form
              onSubmit={handleResetPassword}
              className="mt-7 space-y-4"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  OTP
                </label>

                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleOnChange}
                  placeholder="Enter 6 digit OTP"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  New Password
                </label>

                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleOnChange}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Confirm Password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleOnChange}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={resetUserPassword.isPending}
                className="h-12 w-full rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {resetUserPassword.isPending
                  ? "Resetting Password..."
                  : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;