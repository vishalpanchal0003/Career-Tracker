import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    userDetailsUpdate,
    userProfile,
} from "../api/userApiInstance";

import {
    Check,
    Mail,
    Pencil,
    UserRound,
    X,
} from "lucide-react";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import LoadingState from "./CommomCompo/LoadingState";

const Profile = () => {
    const queryClient = useQueryClient();

    const [isSelected, setIsSelected] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        bio: "",
    });

    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["my-profile"],
        queryFn: userProfile,
        enabled: Boolean(
            localStorage.getItem("accessToken")
        ),
    });

    const user = data?.data;

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || "",
                bio: user.bio || "",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const updateProfileMutation = useMutation({
        mutationFn: userDetailsUpdate,

        onSuccess: async (response) => {
            await queryClient.invalidateQueries({
                queryKey: ["my-profile"],
            });

            setIsSelected(false);

            toast.success(
                response?.data?.message || "Profile updated successfully"
            );
        },

        onError: (error) => {
            toast.error(
                error?.response?.data?.message
            );
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            !formData.fullName.trim() ||
            !formData.bio.trim()
        ) {
            toast.error("Full name and bio required !");
            return;
        }

        updateProfileMutation.mutate(formData);
    };

    const handleCancel = () => {
        setFormData({
            fullName: user?.fullName || "",
            bio: user?.bio || "",
        });

        setIsSelected(false);
    };

    if (isLoading) {
        return (
            <LoadingState />
        );
    }

    if (isError) {
        return (
            <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-5 text-red-300">
                {error?.response?.data?.message ||
                    error?.message ||
                    "failed to load Profile"}
            </div>
        );
    }

    return (
        <div className="min-h-full w-full p-4 text-white sm:p-6">
            <div className="mx-auto max-w-3xl">
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl backdrop-blur-2xl">
                    <div className="relative h-32 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600">
                        <div className="absolute inset-0 bg-black/20" />
                    </div>

                    <div className="relative px-5 pb-6 sm:px-8">
                        <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div className="flex items-end gap-4">
                                <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-slate-900 bg-gradient-to-br from-indigo-500 to-violet-600 text-4xl font-bold shadow-xl">
                                    {user?.fullName
                                        ?.charAt(0)
                                        ?.toUpperCase() || "U"}
                                </div>

                                <div className="pb-1">
                                    <h1 className="text-2xl font-bold">
                                        {user?.fullName || "User"}
                                    </h1>

                                    <p className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                                        <Mail size={15} />
                                        {user?.email || "Email unavailable"}
                                    </p>
                                </div>
                            </div>

                            {!isSelected && (
                                <button
                                    type="button"
                                    onClick={() => setIsSelected(true)}
                                    className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/20"
                                >
                                    <Pencil size={16} />
                                    Edit profile
                                </button>
                            )}
                        </div>

                        {!isSelected ? (
                            <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
                                    <div className="mb-3 flex items-center gap-2 text-sm text-slate-400">
                                        <UserRound size={16} />
                                        Full name
                                    </div>

                                    <p className="text-lg font-medium text-white">
                                        {user?.fullName || "Not available"}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
                                    <div className="mb-3 flex items-center gap-2 text-sm text-slate-400">
                                        <Mail size={16} />
                                        Email address
                                    </div>

                                    <p className="break-all text-lg font-medium text-white">
                                        {user?.email || "Not available"}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 sm:col-span-2">
                                    <p className="mb-3 text-sm text-slate-400">
                                        About you
                                    </p>

                                    <p className="leading-7 text-slate-200">
                                        {user?.bio || "Bio अभी add नहीं की गई है"}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <form
                                onSubmit={handleSubmit}
                                className="mt-8 space-y-5 rounded-2xl border border-indigo-400/20 bg-indigo-400/[0.06] p-5"
                            >
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-300">
                                        Full name
                                    </label>

                                    <input
                                        name="fullName"
                                        type="text"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-300">
                                        Bio
                                    </label>

                                    <textarea
                                        name="bio"
                                        rows="4"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        placeholder="Write something about yourself"
                                        className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                                    />
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-slate-300 transition hover:bg-white/10"
                                    >
                                        <X size={17} />
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={
                                            updateProfileMutation.isPending
                                        }
                                        className="flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-2.5 font-medium text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <Check size={17} />

                                        {updateProfileMutation.isPending
                                            ? "Saving..."
                                            : "Save changes"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;