import { NavLink, Outlet } from "react-router-dom";

const ProfileSection = () => {
    return (
        <div className="min-h-[calc(100vh-80px)] w-full bg-[#070b16] flex flex-col gap-4 p-3 sm:gap-6 sm:p-4 md:flex-row md:p-6">
            <nav className="flex h-fit w-full flex-row gap-2 rounded-2xl bg-white/[0.05] p-2 backdrop-blur-xl sm:p-3 md:sticky md:top-4 md:w-64 md:flex-col">
                <NavLink
                    to="/profile"
                    end
                    className={({ isActive }) =>
                        `flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition sm:text-sm md:justify-start md:px-4 ${isActive
                            ? "bg-black/20 text-white shadow-lg shadow-indigo-500/20"
                            : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                        }`
                    }
                >
                    Profile
                </NavLink>

                <NavLink
                    to="/profile/update"
                    className={({ isActive }) =>
                        `flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition sm:text-sm md:justify-start md:px-4 ${isActive
                            ? "bg-black/20 text-white shadow-lg shadow-indigo-500/20"
                            : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                        }`
                    }
                >
                    Update Profile
                </NavLink>
            </nav>

            <main className="min-w-0 flex-1 overflow-y-auto pb-24 md:pb-0">
                <Outlet />
            </main>
        </div>
    );
};

export default ProfileSection;