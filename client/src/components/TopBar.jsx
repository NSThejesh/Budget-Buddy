import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon, Wallet } from "lucide-react";

const TopBar = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-white/20 dark:border-slate-700/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center gap-3 text-xl font-extrabold tracking-tight"
        >
          <div className="p-2 rounded-lg backdrop-blur-md bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-white/30">
            <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="bg-gradient-to-r from-[#001f3f] via-cyan-400 to-cyan-200 bg-clip-text text-transparent">
            Budget Buddy
          </span>
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-3 rounded-lg backdrop-blur-md bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-300"
          title="Toggle Theme"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          ) : (
            <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          )}
        </button>
      </div>
    </nav>
  );
};

export default TopBar;
