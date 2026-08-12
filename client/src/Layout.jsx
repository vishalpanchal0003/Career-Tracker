import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
// import ProfileSection from "./components/ProfileSection";

const Layout = () => {
    return (
        <div className="flex h-screen w-full flex-col">
            <NavBar />
            {/* <ProfileSection /> */}
            <div className="no-scrollbar flex-1 overflow-y-auto pb-24 md:pb-0">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;