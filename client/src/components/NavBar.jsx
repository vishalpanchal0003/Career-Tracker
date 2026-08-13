import {
  Briefcase,
  LayoutDashboard,
  PlusCircle,
  Sparkles,
  User2,
} from "lucide-react";
import { lazy, Suspense } from "react";

import { NavLink } from "react-router-dom";
const LogOutButton = lazy(() => import("./CommomCompo/LogOut"))

const NavBar = () => {
  const navItems = [
    {
      label: "Dashboard",
      to: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Create",
      to: "/createjob",
      icon: PlusCircle,
    },
    {
      label: "Applications",
      to: "/alljobs",
      icon: Briefcase,
    },
    {
      label: "Profile",
      to: "/profile",
      icon: User2,
    },
  ];

  return (
    <>
      {/* Mobile Logout - top right */}
      <div className="fixed right-2 top-2 z-[100] md:hidden">
        <Suspense fallback={"loading...."}>
          <LogOutButton />
        </Suspense>

      </div>

      {/* Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex w-full items-center border-t border-white/10 bg-black/80 px-2 py-2 backdrop-blur-xl md:static md:border-b md:border-t-0 md:px-6 md:py-3">
        {/* Logo - desktop only */}
        <div className="hidden shrink-0 items-center gap-2 text-indigo-400 md:flex">
          <Sparkles size={18} />

          <span className="text-sm font-semibold tracking-wide text-white">
            Career Tracker
          </span>
        </div>

        {/* Nav links */}
        <div className="flex w-full items-center justify-around gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-1 md:mx-auto md:w-auto md:justify-center">
          {navItems.map(
            ({ label, to, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[10px] transition sm:px-3 md:flex-row md:gap-2 md:px-4 md:py-2 md:text-sm ${isActive
                    ? "bg-indigo-500/10 text-indigo-400 md:bg-black/20 md:text-white"
                    : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            )
          )}
        </div>

        {/* Logout - desktop right */}
        <div className="ml-auto hidden shrink-0 items-center md:flex">
          <LogOutButton />
        </div>
      </nav>
    </>
  );
};

export default NavBar;