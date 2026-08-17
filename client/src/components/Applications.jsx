import {
    useInfiniteQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { Sparkles, } from "lucide-react";
import { lazy, useMemo, useState, useEffect, useRef } from "react";
import { toast } from "sonner";

import { deleteJob, InfiniteScroll, } from "../api/jobApiInstance";
const UpdateJob = lazy(() => import('./UpdateJob'))
import LoadingState from "./CommomCompo/LoadingState";
import { Suspense } from "react";
import { useCallback } from "react";
const JobCard = lazy(() => import("./CommomCompo/JobCard"))


const statusStyles = {
    Applied: "border-blue-400/20 bg-blue-500/10 text-blue-300",
    Interviewing: "border-yellow-400/20 bg-yellow-500/10 text-yellow-300",
    Rejected: "border-red-400/20 bg-red-500/10 text-red-300",
    Offer: "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
    Withdrawn: "border-slate-400/20 bg-slate-500/10 text-slate-300",
};

const Applications = () => {

    const sentinelRef = useRef(null)
    const queryClient = useQueryClient();
    const [selectedJob, setSelectedJob] = useState(null);
    const [searchTerm, setSearchTerm] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const {
        data,
        isLoading,
        isError,
        error,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteQuery({
        queryKey: ["jobs"],

        queryFn: ({ pageParam }) =>
            InfiniteScroll(pageParam),
        staleTime: 5 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        initialPageParam: 0,

        getNextPageParam: (lastPage) => {
            if (!lastPage.data?.hasMore) {
                return undefined;
            }

            return lastPage.data.nextOffset;
        }
    });

    const jobs = data?.pages.flatMap(
        page => page?.data?.data || []
    )
    const deleteJobMutation = useMutation({
        mutationFn: deleteJob,
        onSuccess: (response) => {
            toast.success(response?.data?.message || "Application deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
        },
        onError: (error) => {
            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to delete application"
            );
        },
    });


    useEffect(() => {
        if (!sentinelRef.current) return;
        const observer = new IntersectionObserver((entries) => {
            const [entry] = entries;
            if (entry.isIntersecting) {
                if (!isFetchingNextPage && hasNextPage) {
                    fetchNextPage();
                }
            }
        }, {
            root: null,
            rootMargin: "100px",
            threshold: 0
        });
        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);




    useEffect(() => {
        const timer = setTimeout(() => {
            console.log("Debounced:", searchTerm)
            setDebouncedSearch(searchTerm);
        }, 200);
        return () => clearTimeout(timer);
    }, [searchTerm]);



    const filteredData = useMemo(() => {
        return jobs?.filter((job) =>
            job.company?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            job.role?.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
    }, [jobs, debouncedSearch]);


    const appliedDate = useCallback(
        (job) => {
            return job.dateApplied
                ? new Date(job.dateApplied).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                })
                : "Not specified";
        },
        [],
    )




    const handleDelete = (jobId, companyName) => {
        const toastId = `delete-${jobId}`;

        if (toast.isActive?.(toastId)) {
            return;
        }

        toast(`Delete application for "${companyName}"?`, {
            id: toastId,

            description: "This action cannot be undone.",

            action: {
                label: "Delete",
                onClick: () => {
                    deleteJobMutation.mutate(jobId);
                },
            },

            cancel: {
                label: "Cancel",
                onClick: () => {
                    toast.dismiss(toastId);
                },
            },
            duration: Infinity,
        });
    };

    const handleEdit = (job) => {
        setSelectedJob(job);
    };

    const closeUpdateForm = () => {
        setSelectedJob(null);
    };

    if (isLoading) {
        return (
            <LoadingState />
        );
    }

    if (isError) {
        return (
            <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-5 text-red-300">
                {error?.response?.data?.message ||
                    error?.message ||
                    "Jobs load failed"}
            </div>
        );
    }

    return (
        <>
            <Suspense fallback={<LoadingState />}>
                {selectedJob && (
                    <UpdateJob selectedJob={selectedJob} onClose={closeUpdateForm} />
                )}

                <main

                    className="min-h-screen bg-[#070b16] px-4 py-8 text-white sm:px-6 lg:px-10">
                    <div className="mx-auto max-w-7xl">
                        <div className="fixed md:static z-50 backdrop-blur-2xl bg-black/20 w-full top-0 left-0">
                            <div className="w-full">
                                <div className="mt-2 ml-4 flex items-center gap-2  text-indigo-400">
                                    <Sparkles size={18} className="mt-4" />
                                    <span className="text-sm mt-4 font-medium">
                                        Career Tracker
                                    </span>
                                </div>

                                <h1 className="mt-2 ml-4 text-3xl font-bold tracking-tight">
                                    My Applications
                                </h1>
                                <p className="mt-2 ml-4 text-sm text-slate-400">
                                    Track all your job applications in one place.
                                </p>
                                <div className="z-50 mb-3 flex w-full gap-2 bg-transparent py-2 sm:py-2">
                                    <input
                                        className="w-full flex-1 rounded-lg bg-white/20 px-3 py-2 text-sm text-white outline-none backdrop-blur placeholder:text-slate-400 focus:border focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 sm:px-4 sm:py-2.5"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        type="text"
                                        placeholder="Search Company & Role ..."
                                    />
                                </div>
                            </div>
                        </div>

                        {filteredData?.length === 0 && searchTerm.trim() !== "" ? (
                            <div className="flex min-h-75 items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
                                <div>
                                    <h2 className="text-xl font-semibold text-white">
                                        No applications found
                                    </h2>

                                    <p className="mt-2 text-sm text-slate-400">
                                        No company or role matches{" "}
                                        <span className="font-medium text-indigo-300">
                                            "{searchTerm}"
                                        </span>
                                    </p>

                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="mt-5 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-600"
                                    >
                                        Clear Search
                                    </button>
                                </div>
                            </div>
                        ) : (

                            <div className="mt-40 grid grid-cols-1 gap-5 md:mt-0 md:grid-cols-2 xl:grid-cols-3">


                                {filteredData?.map((job) => {
                                    appliedDate
                                    return (

                                        <JobCard
                                            appliedDate={appliedDate}
                                            statusStyles={statusStyles}
                                            Detail={Detail}
                                            key={job._id}
                                            job={job}
                                            handleEdit={handleEdit}
                                            handleDelete={handleDelete}
                                        />

                                    );
                                })}
                            </div>
                        )}

                    </div>
                    {isFetchingNextPage && (
                     <div className="flex w-full items-center justify-center py-5">
        <span className="text-center text-sm text-slate-400">
            Loading More ....
        </span>
    </div>
                )}
             {!hasNextPage && (
    <div className="flex w-full items-center justify-center py-5">
        <span className="text-center text-sm text-slate-400">
            You reached the end
        </span>
    </div>
)}
                    <div ref={sentinelRef} />

                </main>
            </Suspense>
        </>
    );
};

const Detail = ({ icon, label, value }) => {
    return (
        <div className="min-w-0">
            <div className="mb-1 flex items-center gap-1.5 text-xs text-slate-500">
                <span className="text-indigo-400">{icon}</span>
                {label}
            </div>

            <p className="truncate text-sm font-medium text-slate-200">
                {value || "Not specified"}
            </p>
        </div>
    );
};

export default Applications;