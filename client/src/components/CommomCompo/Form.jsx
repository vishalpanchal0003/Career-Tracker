import { useEffect, useState } from "react";
import {
  Building2,
  BriefcaseBusiness,
  MapPin,
  Link as LinkIcon,
  CalendarDays,
  IndianRupee,
  FileText,
  CircleDot,
  ChevronDown,
  Plus,
  Save,
  Briefcase,
  StickyNote,
} from "lucide-react";
import { toast } from "sonner";

const emptyFormData = {
  company: "",
  role: "",
  location: "",
  link: "",
  dateApplied: "",
  status: "Applied",
  salary: "",
  notes: "",
  resumeVersion: "",
};

const inputClass =
  "w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-teal-400 focus:bg-slate-800 focus:ring-4 focus:ring-teal-400/10";

const labelClass =
  "mb-2 flex items-center gap-2 text-sm font-medium text-slate-300";

const JobForm = ({
  initialData = emptyFormData,
  onSubmitJob,
  isSubmitting = false,
  mode = "create",
}) => {
  const [formData, setFormData] = useState({
    ...emptyFormData,
    ...initialData,
  });

  const isEdit = mode === "edit";

  useEffect(() => {
    setFormData({
      ...emptyFormData,
      ...initialData,
      dateApplied: initialData?.dateApplied
        ? String(initialData.dateApplied).slice(0, 10)
        : "",
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.company.trim() ||
      !formData.role.trim() ||
      !formData.location.trim() ||
      !formData.dateApplied
    ) {
      toast.error("All required fields must be filled!");
      return;
    }

    if (!onSubmitJob) {
      toast.error("Submit function is missing");
      return;
    }

    onSubmitJob(formData);

    if (!isEdit) {
      setFormData(emptyFormData);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20">
            <Briefcase size={21} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {isEdit ? "Edit application" : "Add a new application"}
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              {isEdit
                ? "Update the details of your application."
                : "Keep your job search organized and up to date."}
            </p>
          </div>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-2xl shadow-black/30 sm:p-8"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormInput
              label="Company"
              icon={<Building2 size={17} />}
              name="company"
              placeholder="e.g. TCS"
              value={formData.company}
              onChange={handleChange}
            //   required
            />

            <FormInput
              label="Role"
              icon={<BriefcaseBusiness size={17} />}
              name="role"
              placeholder="e.g. Backend Developer"
              value={formData.role}
              onChange={handleChange}
            //   required
            />

            <FormInput
              label="Location"
              icon={<MapPin size={17} />}
              name="location"
              placeholder="e.g. Remote / Indore"
              value={formData.location}
              onChange={handleChange}
            //   required
            />

            <FormInput
              label="Job link"
              icon={<LinkIcon size={17} />}
              name="link"
              type="url"
              placeholder="https://company.com/job"
              value={formData.link}
              onChange={handleChange}
            />

            <FormInput
              label="Date applied"
              icon={<CalendarDays size={17} />}
              name="dateApplied"
              type="date"
              value={formData.dateApplied}
              onChange={handleChange}
            //   required
            />

            {/* Status */}
            <div>
              <label className={labelClass}>
                <CircleDot size={17} className="text-teal-400" />
                Application status
              </label>

              <div className="relative">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`${inputClass} cursor-pointer appearance-none pr-11`}
                >
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interviewing</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Offer">Offer</option>
                  <option value="Ghosted">Ghosted</option>
                  <option value="Screening">Screening</option>
                  <option value="Wishlist">Wishlist</option>
                </select>

                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>

            <FormInput
              label="Salary"
              icon={<IndianRupee size={17} />}
              name="salary"
              placeholder="e.g. 5 LPA"
              value={formData.salary}
              onChange={handleChange}
            />

            <FormInput
              label="Resume version"
              icon={<FileText size={17} />}
              name="resumeVersion"
              placeholder="e.g. Frontend Resume v1"
              value={formData.resumeVersion}
              onChange={handleChange}
            />
          </div>

          {/* Notes */}
          <div className="mt-5">
            <label className={labelClass}>
              <StickyNote size={17} className="text-teal-400" />
              Notes
            </label>

            <textarea
              name="notes"
              rows={4}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add recruiter details, interview date, follow-up notes..."
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Submit */}
          <div className="mt-8 flex justify-end border-t border-slate-800 pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-teal-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-500/20 transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isEdit ? <Save size={18} /> : <Plus size={18} />}

              {isSubmitting
                ? "Saving..."
                : isEdit
                  ? "Save changes"
                  : "Add application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FormInput = ({
  label,
  icon,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
}) => {
  return (
    <div>
      <label className={labelClass}>
        <span className="text-teal-400">{icon}</span>
        {label}

        {required && (
          <span className="text-red-400">*</span>
        )}
      </label>

      <input
        name={name}
        type={type}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={inputClass}
      />
    </div>
  );
};

export default JobForm;