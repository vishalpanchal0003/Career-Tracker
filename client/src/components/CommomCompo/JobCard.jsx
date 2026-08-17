import { motion } from "framer-motion"
import { BriefcaseBusiness, Building2, CalendarDays, ExternalLink, FileText, IndianRupee, MapPin, Pencil, Trash2 } from "lucide-react";
import React from "react";




const JobCard = ({ handleDelete, handleEdit, job ,Detail,statusStyles,appliedDate}) => {
    return (
        <div>
           <motion.div
       key={job._id}
    initial={{
        opacity: 0,
        y: 12,
    }}
    whileInView={{
        opacity: 1,
        y: 0,
    }}
    viewport={{
        once: false,
        amount: 0.1,
    }}
    transition={{
        duration: 0.15,
        ease: "linear",
    }}
    whileHover={{
        y: -4,
        transition: {
            duration: 0.15,
            ease: "easeOut",
        },
    }}
    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/6 p-5 shadow-xl shadow-black/20 backdrop-blur-xl transition-colors hover:border-indigo-400/30"
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
            </motion.div>
        </div>

    )
}


export default React.memo(JobCard)