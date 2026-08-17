import { Sparkles } from "lucide-react";
const Stats = lazy(() => import("../components/Stats"))
import { lazy, Suspense } from "react";
import LoadingState from "../components/CommomCompo/LoadingState";
const Chart = lazy(() => import("../components/Chart"))
const Dashboard = () => {
  return (
    <Suspense fallback={<LoadingState />}>
      <div className="h-screen w-full px-3 py-6 text-white sm:px-6 sm:py-8">
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
        </div>
        <Stats />
        <Chart />
      </div>
    </Suspense>
  );
};
export default Dashboard