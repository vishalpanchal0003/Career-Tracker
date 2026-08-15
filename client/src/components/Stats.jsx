import { useQuery } from "@tanstack/react-query";
import {
  BriefcaseBusiness,
  XCircle,
  MessageSquare,
  Trophy,
  TrendingUp,
} from "lucide-react";

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
  });


  const jobStats = data?.data;

  const total = jobStats?.total || 0;
  const rejected = jobStats?.rejected || 0;
  const interviewing = jobStats?.interviewing || 0;
  const offers = jobStats?.offers || 0;



  const getPercentage = (value) => {
    if (!total) return 0;

    return Math.round((value / total) * 100);
  };


  const stats = [
    {
      title: "Total Applied",
      value: total,
      percentage: 100,
      icon: BriefcaseBusiness,
      gradient: "from-indigo-500/20 to-blue-500/10",
      iconBg: "bg-indigo-500/15",
      iconColor: "text-indigo-400",
      bar: "bg-indigo-500",
    },

    {
      title: "Rejected",
      value: rejected,
      percentage: getPercentage(rejected),
      icon: XCircle,
      gradient: "from-red-500/20 to-rose-500/10",
      iconBg: "bg-red-500/15",
      iconColor: "text-red-400",
      bar: "bg-red-500",
    },

    {
      title: "Interview",
      value: interviewing,
      percentage: getPercentage(interviewing),
      icon: MessageSquare,
      gradient: "from-amber-500/20 to-orange-500/10",
      iconBg: "bg-amber-500/15",
      iconColor: "text-amber-400",
      bar: "bg-amber-500",
    },

    {
      title: "Offers",
      value: offers,
      percentage: getPercentage(offers),
      icon: Trophy,
      gradient: "from-emerald-500/20 to-green-500/10",
      iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-400",
      bar: "bg-emerald-500",
    },
  ];


  if (isLoading) {
    return <LoadingState />;
  }


  if (isError) {
    return (
      <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-5 text-red-300 backdrop-blur-xl">
        {error?.response?.data?.message || "Failed to load statistics"}
      </div>
    );
  }


  return (
    <section className="w-full">

      {/* HEADER */}

      <div className="mb-5 flex items-end justify-between">

        <div>

          <div className="flex items-center gap-2">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10">
              <TrendingUp
                size={17}
                className="text-indigo-400"
              />
            </div>

            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Application Overview
            </h2>

          </div>

          <p className="mt-2 text-xs text-slate-500 sm:text-sm">
            Your current job application progress
          </p>

        </div>


        <div className="hidden rounded-full border border-emerald-400/10 bg-emerald-400/5 px-3 py-1.5 sm:block">

          <span className="text-xs font-medium text-emerald-400">
            Career Progress
          </span>

        </div>

      </div>


      {/* STATS */}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">

        {stats.map((stat) => {

          const Icon = stat.icon;

          return (

            <div
              key={stat.title}
              className={`
                                group relative overflow-hidden
                                rounded-2xl
                                border border-white/[0.08]
                                bg-gradient-to-br ${stat.gradient}
                                p-4
                                shadow-lg shadow-black/10
                                backdrop-blur-xl
                                transition-all duration-300
                                hover:-translate-y-1
                                hover:border-white/[0.15]
                                hover:shadow-xl
                                sm:rounded-3xl
                                sm:p-5
                            `}
            >

              {/* Background glow */}

              <div
                className={`
                                    pointer-events-none
                                    absolute
                                    -right-10
                                    -top-10
                                    h-28
                                    w-28
                                    rounded-full
                                    ${stat.iconBg}
                                    blur-3xl
                                    transition-transform
                                    duration-500
                                    group-hover:scale-150
                                `}
              />


              {/* TOP */}

              <div className="relative flex items-start justify-between">

                <div>

                  <p className="text-[11px] font-medium text-slate-400 sm:text-xs">
                    {stat.title}
                  </p>

                  <h3 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {stat.value}
                  </h3>

                </div>


                <div
                  className={`
                                        flex h-9 w-9
                                        items-center justify-center
                                        rounded-xl
                                        border border-white/[0.08]
                                        ${stat.iconBg}
                                        backdrop-blur-md
                                        sm:h-10 sm:w-10
                                    `}
                >

                  <Icon
                    size={18}
                    className={stat.iconColor}
                  />

                </div>

              </div>


              {/* BOTTOM */}

              <div className="relative mt-5">

                <div className="mb-2 flex items-center justify-between">

                  <span className="text-[10px] text-slate-500 sm:text-xs">
                    Application share
                  </span>

                  <span className={`text-xs font-semibold ${stat.iconColor}`}>
                    {stat.percentage}%
                  </span>

                </div>


                {/* Progress bar */}

                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">

                  <div
                    className={`h-full rounded-full ${stat.bar} transition-all duration-700`}
                    style={{
                      width: `${stat.percentage}%`,
                    }}
                  />

                </div>

              </div>


            </div>

          );

        })}

      </div>

    </section>
  );
};


export default Stats;