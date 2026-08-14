import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "../utils/ProtectedRoute";
import Layout from "../Layout";
import LoadingState from "../components/CommomCompo/LoadingState";
const ForgotPassword = lazy(() => import("../components/ResetPassword"))
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Applications = lazy(() => import("../components/Applications"));
const ProfileSection = lazy(() => import("../components/ProfileSection"));
const Profile = lazy(() => import("../components/Profile"));
const UpdateProfile = lazy(() => import("../components/UpdateProfile"));
const Login = lazy(() => import("../components/Login"));
const Register = lazy(() => import("../components/Register"));
const CreateJobForm = lazy(() => import("../components/CreateJobForm"));

const PagesRoute = () => {
    return (
        <Suspense
            fallback={
                <LoadingState />
            }
        >
            <Routes>

                {/* Public Routes */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/"
                    element={<Register />}
                />

                <Route
                    path="/forgotpassword"
                    element={<ForgotPassword />} />
                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>

                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />

                        <Route
                            path="/createjob"
                            element={<CreateJobForm />}
                        />

                        <Route
                            path="/alljobs"
                            element={<Applications />}
                        />

                        {/* Profile Routes */}
                        <Route
                            path="/profile"
                            element={<ProfileSection />}
                        >
                            <Route
                                index
                                element={<Profile />}
                            />

                            <Route
                                path="update"
                                element={<UpdateProfile />}
                            />
                        </Route>

                    </Route>
                </Route>

            </Routes>
        </Suspense>
    );
};

export default PagesRoute;