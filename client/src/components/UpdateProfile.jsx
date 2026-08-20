import {
    LockKeyhole,
} from "lucide-react";
import PasswordInput from "./CommomCompo/IsShowPass";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateUserPassword } from "../api/userApiInstance";
import { toast } from "sonner";

const UpdateProfile = () => {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const updatePasswordMutaion = useMutation({
        mutationFn: (userData) => updateUserPassword(userData),
        onSuccess: (response) => {
            toast(response?.data?.message || "password changed ")
        },
        onError: (error) => {
            toast(error?.response?.data?.message)
        }
    })
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.currentPassword && !formData.newPassword && !formData.newPassword) {
            toast("all feilds are required")
            return;
        }
        updatePasswordMutaion.mutate(formData);
        setFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        })
    }
    const onChange = (e) => {
        let { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))

    }

    return (
        <div className="min-h-full w-full p-4 text-white sm:p-6">
            <div className="mx-auto max-w-2xl">
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl backdrop-blur-2xl">
                    {/* Header */}
                    <div className="border-b border-white/10 bg-gradient-to-r from-indigo-600/30 via-violet-600/20 to-fuchsia-600/20 p-6 sm:p-8">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-300">
                            <LockKeyhole size={28} />
                        </div>

                        <h1 className="text-2xl font-bold sm:text-3xl">
                            Change password
                        </h1>

                        <p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">
                            Update your password to keep your account safe and secure.
                        </p>
                    </div>

                    {/* Form */}
                    <form className="space-y-6 p-6 sm:p-8"
                        onSubmit={handleSubmit}
                    >
                        <div>
                            <label
                                htmlFor="currentPassword"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                Current password
                            </label>

                            <div className="relative">
                        
                                <PasswordInput
                                    onChange={onChange}
                                    value={formData.currentPassword}
                                    name="currentPassword"
                                    type="password"
                                    placeholder="Enter current password"
                                />

                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="newPassword"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                New password
                            </label>

                            <div className="relative">
                                <PasswordInput
                                    onChange={onChange}
                                    value={formData.newPassword}
                                    name="newPassword"
                                    type="password"
                                    placeholder="Enter new password"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                Confirm new password
                            </label>

                            <div className="relative">


                                <PasswordInput
                                    onChange={onChange}
                                    value={formData.confirmPassword}
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>

                        {/* Password hint */}
                        <div className="rounded-2xl border border-indigo-400/20 bg-indigo-400/[0.08] p-4">
                            <p className="text-sm font-medium text-indigo-200">
                                Password tips
                            </p>

                            <p className="mt-1 text-sm leading-6 text-slate-400">
                                Use a strong password with a mix of uppercase letters,
                                lowercase letters, numbers and special characters.
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">

                            <button
                                type="submit"
                                className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-600 hover:to-violet-700"
                            >
                                Update password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateProfile;