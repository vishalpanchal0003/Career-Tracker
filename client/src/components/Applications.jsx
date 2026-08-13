import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import {
    Building2,
    BriefcaseBusiness,
    MapPin,
    CalendarDays,
    IndianRupee,
    FileText,
    ExternalLink,
    Trash2,
    Pencil,
} from "lucide-react";
import { lazy, useState } from "react";
import { toast } from "sonner";

import { deleteJob, getAllJob } from "../api/jobApiInstance";
const UpdateJob = lazy(() => import('./UpdateJob'))
import LoadingState from "./CommomCompo/LoadingState";

const statusStyles = {
    Applied: "border-blue-400/20 bg-blue-500/10 text-blue-300",
    Interviewing: "border-yellow-400/20 bg-yellow-500/10 text-yellow-300",
    Rejected: "border-red-400/20 bg-red-500/10 text-red-300",
    Offer: "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
    Withdrawn: "border-slate-400/20 bg-slate-500/10 text-slate-300",
};

const Applications = () => {

    const queryClient = useQueryClient();
    const [selectedJob, setSelectedJob] = useState(null);
    const [searchTerm, setSearchTerm] = useState("")

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["jobs"],
        queryFn: getAllJob,
    });

    const jobs = Array.isArray(data?.data) ? data.data : [];

    const deleteJobMutation = useMutation({
        mutationFn: deleteJob,
        onSuccess: () => {
            toast.success("Application deleted successfully");
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

    const filterdData = jobs.filter(j =>
        j.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.company.toLowerCase().includes(searchTerm.toLowerCase())

    )

    const handleDelete = (jobId, companyName) => {
        toast(`Delete application for "${companyName}"?`, {
            description: "This action cannot be undone.",
            action: {
                label: "Delete",
                onClick: () => deleteJobMutation.mutate(jobId),
            },
            cancel: {
                label: "Cancel",
                onClick: () => { },
            },
            duration: Infinity
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
            {selectedJob && (
                <UpdateJob selectedJob={selectedJob} onClose={closeUpdateForm} />
            )}

            <main className="min-h-screen bg-[#070b16] px-4 py-8 text-white sm:px-6 lg:px-10">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8">
                        <p className="text-sm font-medium text-indigo-400">
                            Career Tracker
                        </p>

                        <h1 className="mt-2 text-3xl font-bold tracking-tight">
                            My Applications
                        </h1>
                        <p className="mt-2 text-sm text-slate-400">
                            Track all your job applications in one place.
                        </p>
                    </div>
                    <div className="z-50 mb-6 flex w-full gap-2 bg-transparent py-2 sm:py-3">
                        <input
                            className="w-full flex-1 rounded-lg bg-white/20 px-3 py-2 text-sm text-white outline-none backdrop-blur placeholder:text-slate-400 focus:border focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 sm:px-4 sm:py-2.5"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            type="text"
                            placeholder="Search Company & Role ..."
                        />
                    </div>
                    {filterdData.length === 0 ? (
                        <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-10 text-center">
                            <h2 className="text-xl font-semibold">
                                No applications found here...
                            </h2>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {filterdData.map((job) => {
                                const appliedDate = job.dateApplied
                                    ? new Date(job.dateApplied).toLocaleDateString("en-IN", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })
                                    : "Not specified";

                                return (
                                    <div
                                        key={job._id}
                                        className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-black/20 backdrop-blur-xl transition hover:-translate-y-1 hover:border-indigo-400/30"
                                    >
                                        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

                                        <div className="relative flex items-start justify-between gap-4">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-bold">
                                                    {job.company?.charAt(0)?.toUpperCase() || "C"}
                                                </div>

                                                <div className="min-w-0">
                                                    <h2 className="truncate text-lg font-bold">
                                                        {job.company}
                                                    </h2>

                                                    <p className="mt-1 flex items-center gap-1 text-sm text-slate-400">
                                                        <BriefcaseBusiness size={14} />
                                                        <span className="truncate">{job.role}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            <span
                                                className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[job.status] ||
                                                    "border-white/10 bg-white/10 text-slate-300"
                                                    }`}
                                            >
                                                {job.status}
                                            </span>
                                        </div>

                                        <div className="my-5 h-px bg-white/10" />

                                        <div className="grid grid-cols-2 gap-4">
                                            <Detail
                                                icon={<MapPin size={15} />}
                                                label="Location"
                                                value={job.location}
                                            />

                                            <Detail
                                                icon={<CalendarDays size={15} />}
                                                label="Applied on"
                                                value={appliedDate}
                                            />

                                            <Detail
                                                icon={<IndianRupee size={15} />}
                                                label="Salary"
                                                value={job.salary || "Not specified"}
                                            />

                                            <Detail
                                                icon={<FileText size={15} />}
                                                label="Resume"
                                                value={job.resumeVersion || "Not specified"}
                                            />
                                        </div>
                                        <div className="mt-5 rounded-2xl border border-white/10 bg-black/10 p-3">
                                            <p className="mb-1 text-xs font-semibold uppercase text-slate-500">
                                                Notes
                                            </p>

                                            <p className="line-clamp-2 whitespace-pre-line text-sm text-slate-300">
                                                {job.notes || "no any note added yet."}
                                            </p>
                                        </div>

                                        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <Building2 size={14} />
                                                Job application
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {job.link && (
                                                    <a
                                                        href={job.link}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="rounded-xl border border-indigo-400/20 bg-indigo-500/10 px-3 py-2 text-xs text-indigo-300"
                                                    >
                                                        <ExternalLink size={14} />
                                                    </a>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={() => handleEdit(job)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:bg-indigo-500/10 hover:text-indigo-300"
                                                >
                                                    <Pencil size={15} />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(job._id, job.company)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:bg-red-500/10 hover:text-red-300"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
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