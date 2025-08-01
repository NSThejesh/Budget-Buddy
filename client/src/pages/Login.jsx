import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Player } from '@lottiefiles/react-lottie-player';
import TopBar from "../components/TopBar";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        alert(data.msg || "Login failed");
      } else {
        localStorage.setItem("token", data.token);
        alert("Login Successful!");
        navigate("/home");
      }
    } catch (err) {
      alert("Something went wrong.");
    }
  };
  

  return (
    <>
      <TopBar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-[#0c0f1c] dark:to-[#1a1d2e] p-4 pt-20 transition-colors duration-300">
        <div className="w-full max-w-3xl backdrop-blur-2xl bg-white/10 dark:bg-white/5 rounded-3xl shadow-2xl overflow-hidden md:flex border border-white/20 dark:border-white/10 hover:shadow-3xl hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300">
          {/* Animation Section */}
          <div className="md:w-5/12 bg-[#001f3f] dark:bg-blue-900 p-6 flex items-center justify-center rounded-tl-3xl rounded-bl-3xl">
            <Player
              autoplay
              loop
              src="/animations/login.json"
              style={{ height: '300px', width: '300px' }}
            />
          </div>

          {/* Form Section */}
          <div className="md:w-7/12 p-8 md:p-10 flex items-center justify-center backdrop-blur-md bg-white/20 dark:bg-white/10">
            <div className="w-full">
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 dark:text-gray-100 mb-6 text-center transition-all duration-300 transform hover:scale-105">
                Welcome Back
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  onChange={handleChange}
                  className="w-full p-4 backdrop-blur-md bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 text-slate-800 dark:text-gray-100 transition-all duration-300 hover:scale-105 hover:bg-white/30 dark:hover:bg-white/20"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  onChange={handleChange}
                  className="w-full p-4 backdrop-blur-md bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 text-slate-800 dark:text-gray-100 transition-all duration-300 hover:scale-105 hover:bg-white/30 dark:hover:bg-white/20"
                />
                <button
                  type="submit"
                  className="w-full py-3 backdrop-blur-md bg-gradient-to-r from-green-500/80 to-emerald-500/80 dark:from-green-400/80 dark:to-emerald-400/80 border border-white/30 dark:border-white/20 text-white rounded-lg shadow-md hover:from-green-600/90 hover:to-emerald-600/90 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 transition-all duration-300 transform hover:scale-105"
                >
                  Login
                </button>
              </form>
              <p className="mt-4 text-center text-sm text-slate-700 dark:text-gray-300">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300"
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
