import { useEffect, useState } from 'react';
import { User, Mail, ArrowRight, Text } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/userApiInstance';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { motion } from "framer-motion";
import PasswordInput from "../components/CommomCompo/IsShowPass";

const Register = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            navigate('/dashboard', { replace: true });
        }
    }, [navigate]);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        bio: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const registerMutation = useMutation({
        mutationFn: (userData) => register(userData),
        onSuccess: (response) => {
            const token = response?.data?.accesstoken;

            if (token) {
                localStorage.setItem("accessToken", token);
                toast.success("Registration successful!");
                navigate("/dashboard", { replace: true });
            } else {
                navigate("/login", { replace: true });
            }
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to register");
            console.error(error);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.fullName || !formData.email || !formData.password) {
            toast.error("Missing fields! Please fill all required fields.");
            return;
        }
        registerMutation.mutate(formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-8 text-black">
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
                            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                            <p className="text-blue-100 text-sm">Join us today and start your journey</p>
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
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        placeholder="John Doe"
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white/90 hover:border-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Email Address <span className="text-red-500">*</span>
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
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <PasswordInput
                                        type="password"
                                        name="password"
                                        onChange={handleChange}
                                        placeholder="Create a strong password"
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white/90 hover:border-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Bio <span className="text-gray-400 font-normal">(Optional)</span>
                                </label>
                                <div className="relative">
                                    <Text className="absolute left-3.5 top-4 text-gray-400 h-5 w-5" />
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Tell us about yourself..."
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white/90 hover:border-gray-400 resize-none"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={registerMutation.isPending}
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {registerMutation.isPending ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        Create Account <ArrowRight className="h-5 w-5" />
                                    </>
                                )}
                            </motion.button>

                            {/* Login Link */}
                            <div className="text-center pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-600">
                                    Already have an account?{' '}
                                    <Link
                                        to="/login"
                                        className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors"
                                    >
                                        Log in here
                                    </Link>
                                </p>
                            </div>
                        </motion.form>
                    </div>
                </div>

                {/* Footer Text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="text-center text-xs text-gray-500 mt-6"
                >
                    By creating an account, you agree to our{' '}
                    <span className="text-blue-600 cursor-pointer hover:underline">Terms of Service</span>
                    {' '}and{' '}
                    <span className="text-blue-600 cursor-pointer hover:underline">Privacy Policy</span>
                </motion.p>
            </motion.div>
        </div>
    );
};

export default Register;