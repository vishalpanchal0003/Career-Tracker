// import { Toaster } from "sonner";
import Stats from "../src/components/Stats";

const Dashboard = () => {
  return (
    <div className="min-h-screen w-full bg-[#070b16] px-3 py-6 text-white sm:px-6 sm:py-8">
      {/* <Toaster richColors position="top-center"/> */}
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 sm:mb-8">
          <p className="text-xs font-medium text-indigo-400 sm:text-sm">
            Career Tracker
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-2 text-xs text-slate-400 sm:text-sm">
            Overview of your job application progress
          </p>
        </div>
        <Stats />
      </div>
    </div>
  );
};
export default Dashboard