import { useEffect, useState } from 'react';
import { User, Mail, ArrowRight, Text } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/userApiInstance';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { motion } from "framer-motion"
import PasswordInput from "../components/CommomCompo/IsShowPass"

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
                toast.success("Register successfully ");
                navigate("/dashboard", { replace: true });
            } else {
                navigate("/login", { replace: true });
            }
        },
        onError: (error) => {
            toast.error(error.response.data.message || "Faield to register")
            console.error(error);
        }
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.fullName || !formData.email || !formData.password) {
            toast.error("Missing fields! Check keys.");
            return;
        }
        registerMutation.mutate(formData);

    };

    return (
        <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex items-center justify-center bg-white/30 px-4">
            <div className="w-full max-w-md backdrop-blur-2xl rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-8 text-center">
                    <h2 className="text-3xl font-bold text-black mb-2">Create Account</h2>
                    <p className="text-black/70 text-sm">Join us today and start your journey</p>
                </div>
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">FullName</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your full name"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <PasswordInput
                                    type={'password'}
                                    name={"password"}
                                    onChange={handleChange}
                                    placeholder={'Set your Password'}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"

                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                            <div className="relative">
                                <Text className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <textarea

                                    type="text"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    required
                                    placeholder="Bio"
                                    className="w-full  pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>

                        <button
                            disabled={registerMutation.isPending}
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            {registerMutation.isPending ? "Register In" : "Register"} <ArrowRight className="h-4 w-4" />
                        </button>

                        <div className="text-center mt-4">
                            <p className="text-sm text-black">
                                Already have an account?{' '}
                                <Link to="/login" className="text-black font-medium hover:underline">
                                    Log in here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default Register;