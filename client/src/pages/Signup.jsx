import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import TopBar from "../components/TopBar";

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name || !formData.email || !formData.password) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            // Make the actual API call to the backend
            const res = await fetch("http://localhost:3001/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                // Successful signup, redirect to login page
                alert("Signup Successful! Please login.");
                navigate("/login");
            } else {
                // Handle failure response from backend
                alert(data.msg || "Signup failed. Please try again.");
            }
        } catch (err) {
            // Handle any other errors
            alert("Something went wrong. Please try again later.");
        }
    };

    return (
        <>
            <TopBar />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-[#0c0f1c] dark:to-[#1a1d2e] p-4 pt-20 transition-all duration-300">
                <div className="w-full max-w-3xl backdrop-blur-2xl bg-white/10 dark:bg-white/5 rounded-3xl shadow-2xl overflow-hidden md:flex border border-white/20 dark:border-white/10 hover:shadow-3xl hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300">
                    {/* Lottie Image */}
                    <div className="md:w-5/12 bg-[#001f3f] dark:bg-blue-900 p-6 flex items-center justify-center rounded-tl-3xl rounded-bl-3xl">
                        <Player
                            autoplay
                            loop
                            src="/animations/signup.json"
                            style={{ height: "300px", width: "300px" }}
                        />
                    </div>

                    {/* Form */}
                    <div className="md:w-7/12 p-8 md:p-10 flex items-center justify-center backdrop-blur-md bg-white/20 dark:bg-white/10">
                        <div className="w-full">
                            <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 dark:text-slate-100 mb-6 text-center transition-all duration-300 transform hover:scale-105">
                                Create Your Account
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full p-4 backdrop-blur-md bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 text-slate-800 dark:text-gray-100 transition-all duration-300 hover:scale-105 hover:bg-white/30 dark:hover:bg-white/20"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-4 backdrop-blur-md bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 text-slate-800 dark:text-gray-100 transition-all duration-300 hover:scale-105 hover:bg-white/30 dark:hover:bg-white/20"
                                />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full p-4 backdrop-blur-md bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 text-slate-800 dark:text-gray-100 transition-all duration-300 hover:scale-105 hover:bg-white/30 dark:hover:bg-white/20"
                                />
                                <button
                                    type="submit"
                                    className="w-full py-3 backdrop-blur-md bg-gradient-to-r from-green-500/80 to-emerald-500/80 dark:from-green-400/80 dark:to-emerald-400/80 border border-white/30 dark:border-white/20 text-white rounded-lg shadow-md hover:from-green-600/90 hover:to-emerald-600/90 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition-all duration-300 transform hover:scale-105"
                                >
                                    Signup
                                </button>
                            </form>

                            {/* OR Divider */}
                            <div className="my-4 text-center text-slate-600 dark:text-slate-300 font-medium">
                                <div className="flex items-center justify-center gap-2">
                                    <span className="flex-1 h-px bg-gray-300 dark:bg-slate-600" />
                                    <span>OR</span>
                                    <span className="flex-1 h-px bg-gray-300 dark:bg-slate-600" />
                                </div>
                            </div>

                            {/* Google Signup */}
                            {/* Keeping Google signup button unchanged */}
                            <button
                                onClick={() => {
                                    alert("Google Signup is not implemented.");
                                }}
                                className="w-full py-3 bg-white dark:bg-slate-900 text-black dark:text-white border border-gray-300 dark:border-slate-600 rounded-lg shadow-md hover:bg-red-400 hover:text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                            >
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/archive/c/c1/20190925201609%21Google_%22G%22_logo.svg"
                                    alt="Google Logo"
                                    className="w-5 h-5 mr-3"
                                />
                                Continue with Google
                            </button>

                            {/* Login Redirect */}
                            <p className="mt-4 text-center text-sm text-slate-800 dark:text-slate-300">
                                Already have an account?{" "}
                                <a
                                    href="/login"
                                    className="text-blue-600 hover:underline transition-all duration-300 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                    Login here
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Signup;
