import {
    useInfiniteQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { lazy, useMemo, useState, useEffect, useRef, Suspense, useCallback } from "react";
import { toast } from "sonner";

import { deleteJob, InfiniteScroll } from "../api/jobApiInstance";

const UpdateJob = lazy(() => import("./UpdateJob"));
const JobCard = lazy(() => import("./CommomCompo/JobCard"));
import LoadingState from "./CommomCompo/LoadingState";

const statusStyles = {
    Applied: "border-blue-400/20 bg-blue-500/10 text-blue-300",
    Interviewing: "border-yellow-400/20 bg-yellow-500/10 text-yellow-300",
    Rejected: "border-red-400/20 bg-red-500/10 text-red-300",
    Offer: "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
    Withdrawn: "border-slate-400/20 bg-slate-500/10 text-slate-300",
};

const Applications = () => {
    const sentinelRef = useRef(null);
    const queryClient = useQueryClient();

    const [selectedJob, setSelectedJob] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
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

        queryFn: ({ pageParam }) => InfiniteScroll(pageParam),

        staleTime: 5 * 60 * 1000,
        gcTime: 5 * 60 * 1000,

        initialPageParam: 0,

        getNextPageParam: (lastPage) => {
            if (!lastPage.data?.hasMore) {
                return undefined;
            }

            return lastPage.data.nextOffset;
        },
    });

    // Saare loaded jobs
    const jobs =
        data?.pages.flatMap((page) => page?.data?.data || []) || [];

    /*
     * Search debounce
     */
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 200);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    /*
     * Filtered jobs
     */
    const filteredData = useMemo(() => {
        return jobs.filter(
            (job) =>
                job.company
                    ?.toLowerCase()
                    .includes(debouncedSearch.toLowerCase()) ||
                job.role
                    ?.toLowerCase()
                    .includes(debouncedSearch.toLowerCase())
        );
    }, [jobs, debouncedSearch]);

    /*
     * Infinite scroll
     */
    useEffect(() => {
        if (!sentinelRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;

                if (
                    entry.isIntersecting &&
                    !isFetchingNextPage &&
                    hasNextPage
                ) {
                    fetchNextPage();
                }
            },
            {
                root: null,
                rootMargin: "100px",
                threshold: 0,
            }
        );

        observer.observe(sentinelRef.current);

        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    /*
     * Delete
     */
    const deleteJobMutation = useMutation({
        mutationFn: deleteJob,

        onSuccess: (response) => {
            toast.success(
                response?.data?.message ||
                    "Application deleted successfully"
            );

            queryClient.invalidateQueries({
                queryKey: ["jobs"],
            });
        },

        onError: (error) => {
            toast.error(
                error?.response?.data?.message ||
                    error?.message ||
                    "Failed to delete application"
            );
        },
    });

    /*
     * Applied date
     */
    const appliedDate = useCallback((job) => {
        return job.dateApplied
            ? new Date(job.dateApplied).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
              })
            : "Not specified";
    }, []);

    /*
     * Delete handler
     */
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
        return <LoadingState />;
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

    const noApplications = jobs.length === 0;

    const noSearchResults =
        jobs.length > 0 &&
        searchTerm.trim() !== "" &&
        filteredData.length === 0;

        
    const reachedEnd =
        jobs.length > 1 &&
        filteredData.length > 0 &&
        !hasNextPage &&
        !isFetchingNextPage;

    return (
        <>
            <Suspense fallback={<LoadingState />}>
                {selectedJob && (
                    <UpdateJob
                        selectedJob={selectedJob}
                        onClose={closeUpdateForm}
                    />
                )}

                <main className="min-h-screen bg-[#070b16] px-4 py-8 text-white sm:px-6 lg:px-10">
                    <div className="mx-auto max-w-7xl">

                        {/* HEADER */}
                        <div className="fixed left-0 top-0 z-50 w-full bg-black/20 backdrop-blur-2xl md:static">
                            <div className="w-full">

                                <div className="ml-4 mt-2 flex items-center gap-2 text-indigo-400">
                                    <Sparkles
                                        size={18}
                                        className="mt-4"
                                    />

                                    <span className="mt-4 text-sm font-medium">
                                        Career Tracker
                                    </span>
                                </div>

                                <h1 className="ml-4 mt-2 text-3xl font-bold tracking-tight">
                                    My Applications
                                </h1>

                                <p className="ml-4 mt-2 text-sm text-slate-400">
                                    Track all your job applications in one place.
                                </p>

                                {/* SEARCH */}
                                <div className="mb-3 flex w-full gap-2 bg-transparent py-2 sm:py-2">

                                    <input
                                        disabled={noApplications}
                                        className={`w-full flex-1 rounded-lg bg-white/20 px-3 py-2 text-sm text-white outline-none backdrop-blur placeholder:text-slate-400 focus:border focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 sm:px-4 sm:py-2.5 ${
                                            noApplications
                                                ? "cursor-not-allowed opacity-50"
                                                : "cursor-text"
                                        }`}
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        type="text"
                                        placeholder="Search Company & Role ..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* NO APPLICATIONS */}
                        {noApplications ? (
                            <div className="mt-40 flex min-h-75 items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-10 text-center md:mt-0">
                                <div>
                                    <h2 className="text-xl font-semibold text-white">
                                        No applications yet
                                    </h2>

                                    <p className="mt-2 text-sm text-slate-400">
                                        You haven't added any job applications yet.
                                    </p>
                                </div>
                            </div>
                        ) : noSearchResults ? (

                            /* NO SEARCH RESULTS */

                            <div className="mt-40 flex min-h-75 items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-10 text-center md:mt-0">
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

                            /* APPLICATION CARDS */

                            <div className="mt-40 grid grid-cols-1 gap-5 md:mt-0 md:grid-cols-2 xl:grid-cols-3">

                                {filteredData.map((job) => (
                                    <JobCard
                                        key={job._id}
                                        appliedDate={appliedDate}
                                        statusStyles={statusStyles}
                                        Detail={Detail}
                                        job={job}
                                        handleEdit={handleEdit}
                                        handleDelete={handleDelete}
                                    />
                                ))}

                            </div>
                        )}

                    </div>

                    {/* LOADING MORE */}
                    {isFetchingNextPage && (
                        <div className="flex w-full items-center justify-center py-5">
                            <span className="text-center text-sm text-slate-400">
                                Loading More....
                            </span>
                        </div>
                    )}

                    {/* REACHED END */}
                    {reachedEnd && (
                        <div className="flex w-full items-center justify-center py-5">
                            <span className="text-center text-sm text-slate-400">
                                You reached the end
                            </span>
                        </div>
                    )}

                    {/* SENTINEL */}
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
                <span className="text-indigo-400">
                    {icon}
                </span>

                {label}
            </div>

            <p className="truncate text-sm font-medium text-slate-200">
                {value || "Not specified"}
            </p>
        </div>
    );
};

export default Applications;