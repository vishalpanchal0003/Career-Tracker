import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Sparkles, X } from "lucide-react";
import {toast} from "sonner";

import { updateJobDetails } from "../api/jobApiInstance";
import JobForm from "./CommomCompo/Form";

const UpdateJob = ({ selectedJob, onClose }) => {
  const queryClient = useQueryClient();

  const updateJobMutation = useMutation({
    mutationFn: ({ jobId, jobData }) => updateJobDetails(jobId, jobData),
    onSuccess: (response) => {
      toast.success(
        response?.message ||
        "Job updated successfully"
      );
      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });

      onClose();
    },

    onError: (error) => {
      console.log("Update error:", error);
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Job update failed"
      );
    },
  });

  const handleUpdate = (formData) => {
    updateJobMutation.mutate({
      jobId: selectedJob._id,
      jobData: formData,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#070b16] px-3 py-6 text-white sm:px-4 sm:py-8 md:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-start sm:mb-8">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2 text-xs text-indigo-400 sm:text-sm">
              <Sparkles size={16} className="sm:w-5 sm:h-5" />
              <span className="font-medium">
                Career Tracker
              </span>
            </div>

            <h1 className="text-2xl font-bold sm:text-3xl">
              Update your job
            </h1>

            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              Update the details of your application.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-xl border border-white/10 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        <JobForm
          mode="edit"
          initialData={selectedJob}
          onSubmitJob={handleUpdate}
          isSubmitting={updateJobMutation.isPending}
        />
      </div>
    </div>
  );
};

export default UpdateJob;