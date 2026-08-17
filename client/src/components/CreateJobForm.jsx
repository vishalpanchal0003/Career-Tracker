import { createJob } from "../api/jobApiInstance";
import { toast } from "sonner"
const Form = lazy(() => import('./CommomCompo/Form'))
import { Sparkles } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoadingState from "./CommomCompo/LoadingState";

const JobDetailsForm = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const jobCreateMutation = useMutation({
        mutationFn: createJob,
        onSuccess: (response) => {
            console.log(response)
            navigate("/alljobs")
            console.log("response at jobcreated ", response?.data)
            const newJob = response?.data;
            queryClient.setQueryData(
                queryClient.setQueryData(
                    ["jobs"],
                    (oldData) => ({
                        ...oldData,
                        data: [...(oldData?.data || []), newJob],
                    })
                ))
            console.log("response at jobform", response)
            toast.success(response?.message || "done")

        },
        onError: (error) => {
            console.log('error at createjob ', error)
            toast.error(error?.response?.data?.message || "user mistake")
        }
    })

    return (
        <div
            className="min-h-screen bg-[#070b16] px-4 py-8 text-white sm:px-6 lg:px-10">
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <div className="mb-3 flex items-center gap-2 text-indigo-400">
                            <Sparkles size={18} />
                            <span className="text-sm font-medium">
                                Career Tracker
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Add a new application
                        </h1>

                        <p className="mt-2 text-sm text-slate-400">
                            Keep your job search organized and up to date.
                        </p>
                    </div>

                    <div className="rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 text-xs text-indigo-300">
                        New application
                    </div>
                </div>
                <Suspense fallback={<LoadingState />}>
                    <Form mode="create"
                        onSubmitJob={(formData) => jobCreateMutation.mutate(formData)}
                        isSubmitting={jobCreateMutation.isPending} />
                </Suspense>

            </div>
        </div>
    );
}

export default JobDetailsForm;