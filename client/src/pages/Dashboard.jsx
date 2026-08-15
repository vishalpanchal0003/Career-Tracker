import { Sparkles } from "lucide-react";
import Stats from "../components/Stats";
import Chart from "../components/Chart";
const Dashboard = () => {
  return (
    <div className="h-screen w-full bg-[#070b16] px-3 py-6 text-white sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 sm:mb-8">
          <div className="mb-3 flex items-center gap-2 text-indigo-400">
            <Sparkles size={18} />
            <span className="text-sm font-medium">
              Career Tracker
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-2 text-xs text-slate-400 sm:text-sm">
            Overview of your job application progress
          </p>
        </div>
        <Stats />
        <Chart />
      </div>
    </div>
  );
};
export default Dashboard