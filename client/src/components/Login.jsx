import { useEffect, useState } from 'react';
import { Mail, ArrowRight, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { login } from '../api/userApiInstance';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from './CommomCompo/IsShowPass';
import { motion } from 'framer-motion';

const Login = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            navigate('/dashboard', { replace: true });
        }
    }, [navigate]);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const loginMutation = useMutation({
        mutationFn: (userData) => login(userData),
        onSuccess: (response) => {
            const token = response?.data?.data?.accesstoken;
            if (!token) {
                toast.error("Login response me token nahi mila");
                return;
            }
            localStorage.setItem("accessToken", token);
            navigate("/dashboard", { replace: true });
            toast.success(response?.data?.message || "User Logged In Successfully!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Login failed. Please try again.");
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast.error("All fields are required!");
            return;
        }
        loginMutation.mutate(formData);
    };

    return (
        <div className="min-h-screen text-black flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full max-w-md"
            >
                {/* Card */}
                <div className="backdrop-blur-xl bg-white/80 rounded-2xl shadow-2xl overflow-hidden border border-white/20">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center">
                        <motion.div
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                        >
                            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                            <p className="text-blue-100 text-sm">Sign in to access your dashboard</p>
                        </motion.div>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        <motion.form
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="you@example.com"
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white/90 hover:border-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Password
                                    </label>
                                    <Link
                                        to="/forgotpassword"
                                        className="text-xs text-blue-600 font-medium hover:text-blue-700 hover:underline transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <PasswordInput
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white/90 hover:border-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={loginMutation.isPending}
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loginMutation.isPending ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In <ArrowRight className="h-5 w-5" />
                                    </>
                                )}
                            </motion.button>
                        </motion.form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        {/* Register Link */}
                        <div className="text-center pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link
                                    to="/"
                                    className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors"
                                >
                                    Sign up now
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="text-center text-xs text-gray-500 mt-6"
                >
                    Protected by enterprise-grade security.{' '}
                    <span className="text-blue-600 cursor-pointer hover:underline">Privacy Policy</span>
                </motion.p>
            </motion.div>
        </div>
    );
};

export default Login;