import React, { useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-300"
      >
        {label}
      </label>

      <div className="relative">
        <LockKeyhole
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          id={name}
          name={name}
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-xl border bg-white/[0.06] py-3 pl-11 pr-12 text-white outline-none transition placeholder:text-slate-500 ${error
            ? "border-red-400 focus:ring-2 focus:ring-red-400/20"
            : "border-white/10 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
            }`}
        />

        <button
          type="button"
          onClick={() => setIsVisible((previous) => !previous)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
          aria-label={
            isVisible
              ? "Hide password"
              : "Show password"
          }
        >
          {isVisible ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default React.memo(PasswordInput);