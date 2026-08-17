import { Outlet } from "react-router-dom";
import { motion } from "framer-motion"
import NavBar from "./components/NavBar";

const Layout = () => {
    return (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
animate={{ y: 0, opacity: 1 }}
exit={{ y: -20, opacity: 0 }}
transition={{ duration: 0.25, ease: "easeOut" }}

            className="flex h-screen w-full flex-col">
            <NavBar />
            <div className="no-scrollbar flex-1 overflow-y-auto pb-24 md:pb-0">
                <Outlet />
            </div>
        </motion.div>
    );
};

export default Layout;