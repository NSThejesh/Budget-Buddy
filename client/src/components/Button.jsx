import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

const Button = ({ styles }) => {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleClick = () => {
    navigate("/login"); // Navigate to the login page when the button is clicked
  };

  return (
    <button
      type="button"
      onClick={handleClick} // Set onClick to trigger navigation
      className={`
        py-4 px-6 font-poppins font-medium text-[18px]
        text-white backdrop-blur-md bg-gradient-to-r from-blue-500/80 to-cyan-500/80
        dark:from-blue-400/80 dark:to-cyan-400/80
        border border-white/30 dark:border-white/20
        rounded-[10px] outline-none 
        transition-all duration-300 
        hover:bg-gradient-to-r hover:from-blue-600/90 hover:to-cyan-600/90
        hover:shadow-2xl hover:scale-105
        ${styles}
      `}
    >
      Get Started
    </button>
  );
};

export default Button;
