import { useQuery } from "@tanstack/react-query";
import { getJobStats } from "../api/jobApiInstance";
import LoadingState from "./CommomCompo/LoadingState";

const Stats = () => {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["job-stats"],
    staleTime: 30 * 60 * 1000,
    queryFn: getJobStats,
  },
  );


  const jobStats = data?.data;

  const stats = [
    {
      title: "Total Applied",
      value: jobStats?.total || 0,
      icon: "📄",
      color: "from-blue-500/80 to-blue-700/80",
    },
    {
      title: "Rejected",
      value: jobStats?.rejected || 0,
      icon: "❌",
      color: "from-red-500/80 to-red-700/80",
    },
    {
      title: "Interview",
      value: jobStats?.interviewing || 0,
      icon: "💬",
      color: "from-yellow-500/80 to-orange-600/80",
    },
    {
      title: "Offers",
      value: jobStats?.offers || 0,
      icon: "🎉",
      color: "from-green-500/80 to-emerald-700/80",
    },
  ];

  if (isLoading) {
    return (
      <LoadingState />
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-300/30 bg-red-500/10 p-4 text-red-300 backdrop-blur-lg">
        {error?.response?.data?.message || "Failed to load"}
      </div>
    );
  }

  return (
    <section className="w-full rounded-2xl bg-black/40 p-3 backdrop-blur-md sm:p-5">
      <div className="mb-4 sm:mb-5">
        <h2 className="text-xl font-bold text-white sm:text-2xl">
          Application Overview
        </h2>

        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
          job applications current state
        </p>
      </div>

      {/* Cards Grid - Responsive */}
      <div className="grid w-full grid-cols-1 gap-3 rounded-2xl bg-white/20 p-2 sm:grid-cols-2 sm:gap-4 sm:p-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className={`group relative overflow-hidden rounded-xl border border-white/20 bg-gradient-to-br p-3 text-white shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:border-white/40 hover:shadow-2xl sm:rounded-2xl sm:p-4 ${stat.color}`}
          >
            {/* Glass shine effect */}
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/20 blur-2xl transition-all duration-500 group-hover:scale-150" />

            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-medium text-white/80 sm:text-sm">
                  {stat.title}
                </p>

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/20 text-sm backdrop-blur-md sm:h-9 sm:w-9 sm:text-lg">
                  {stat.icon}
                </div>
              </div>

              <h3 className="mt-3 text-2xl font-bold sm:text-3xl">
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
};

export default Stats;