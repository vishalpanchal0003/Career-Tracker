import { useQuery } from "@tanstack/react-query";
import { getJobStats } from "../api/jobApiInstance";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import {
    PieChart as PieIcon,
    BriefcaseBusiness,
} from "lucide-react";

const Chart = () => {
    const { data } = useQuery({
        queryKey: ["job-stats"],
        staleTime: 30 * 60 * 1000,
        queryFn: getJobStats,
    });

    const jobStats = data?.data;

    const total = jobStats?.total || 0;

    const chartData = [
        {
            title: "Applied",
            value: jobStats?.applied || total,
            color: "#6366f1",
        },
        {
            title: "Interview",
            value: jobStats?.interviewing || 0,
            color: "#f59e0b",
        },
        {
            title: "Offers",
            value: jobStats?.offers || 0,
            color: "#10b981",
        },
        {
            title: "Rejected",
            value: jobStats?.rejected || 0,
            color: "#ef4444",
        },
    ];

    return (
        <section
            className="
                mt-2.5
                w-full
                rounded-3xl
                border border-white/[0.08]
                bg-white/[0.04]
                p-5
                pb-24
                shadow-xl
                shadow-black/10
                backdrop-blur-xl
                md:pb-5
            "
        >

            {/* Header */}

            <div className="mb-4 flex items-center justify-between">

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
                        <PieIcon
                            size={19}
                            className="text-indigo-400"
                        />
                    </div>

                    <div>

                        <h2 className="text-base font-semibold text-white sm:text-lg">
                            Applications by Status
                        </h2>

                        <p className="mt-0.5 text-xs text-slate-500">
                            Your application distribution
                        </p>

                    </div>

                </div>


                {/* Total */}

                <div className="hidden items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 sm:flex">

                    <BriefcaseBusiness
                        size={13}
                        className="text-slate-500"
                    />

                    <span className="text-xs text-slate-400">
                        {total} Total
                    </span>

                </div>

            </div>


            {/* Chart */}

            <div className="relative h-[260px] w-full sm:h-[280px]">

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <PieChart>

                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="title"
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={90}
                            paddingAngle={4}
                            cornerRadius={6}
                            stroke="none"
                        >

                            {chartData.map((entry, index) => (

                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                />

                            ))}

                        </Pie>


                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#111827",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "12px",
                                color: "#fff",
                                boxShadow:
                                    "0 10px 30px rgba(0,0,0,0.3)",
                            }}
                            itemStyle={{
                                color: "#fff",
                            }}
                        />

                    </PieChart>

                </ResponsiveContainer>


                {/* Center */}

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">

                    <span className="text-3xl font-bold text-white">
                        {total}
                    </span>

                    <span className="mt-1 text-xs text-slate-500">
                        Applications
                    </span>

                </div>

            </div>


            {/* Legend */}

            <div className="grid grid-cols-2 gap-3 px-2.5 pb-2">

                {chartData.map((item) => (

                    <div
                        key={item.title}
                        className="
                            flex
                            min-w-0
                            items-center
                            justify-between
                            rounded-xl
                            border border-white/[0.06]
                            bg-white/[0.03]
                            px-3
                            py-2.5
                        "
                    >

                        <div className="flex min-w-0 items-center gap-2">

                            <span
                                className="h-2.5 w-2.5 shrink-0 rounded-full"
                                style={{
                                    backgroundColor: item.color,
                                }}
                            />

                            <span className="truncate text-xs text-slate-400">
                                {item.title}
                            </span>

                        </div>


                        <span className="ml-2 shrink-0 text-sm font-semibold text-white">
                            {item.value}
                        </span>

                    </div>

                ))}

            </div>

        </section>
    );
};

export default Chart;