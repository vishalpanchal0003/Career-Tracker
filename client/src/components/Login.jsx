import { useEffect, useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { login } from '../api/userApiInstance';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from './CommomCompo/IsShowPass';

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
                toast("Login response me token nahi mila");
                return;
            }
            localStorage.setItem("accessToken", token);
            navigate("/dashboard", { replace: true });
            toast.success(response?.data?.message || "User Logged In ");
        },
        onError: (error) => {
            toast(error?.response?.data?.message)
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast("all feilds are reuqired !");
            return;
        }
        loginMutation.mutate(formData);
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br bg-white/30 px-4">
            {/* <Toaster position='top-center' autoClose={3000} /> */}
            <div className="w-full max-w-md backdrop-blur-2xl rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                {/* Header Section */}
                <div className=" p-8 text-center">
                    <h2 className="text-3xl font-bold text-black mb-2">Welcome Back</h2>
                    <p className="text-black/70 text-sm">Sign in to access your dashboard</p>
                </div>

                {/* Form Section */}
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Email Field */}
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

                        {/* Password Field */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <a href="/forgotpassword" className="text-xs text-black hover:underline font-medium">
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative">
                                <PasswordInput
                                    name={"password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder={"Enter Password"}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            disabled={loginMutation.isPending}
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            {loginMutation.isPending ? "Logging in..." : "Login"} <ArrowRight className="h-4 w-4" />
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative  flex justify-center text-sm">
                            <span className="px-4 mt-3 text-black">Or continue with</span>
                        </div>
                    </div>
                    {/* Register Link */}
                    <div className="text-center mt-6">
                        <p className="text-sm text-black">
                            Don't have an account?{' '}
                            <Link to="/" className="text-black font-medium hover:underline">
                                Sign up now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;