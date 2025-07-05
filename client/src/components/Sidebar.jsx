import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  Home,
  CreditCard,
  Target,
  BarChart3,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Wallet
} from "lucide-react";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  // Check if the user is logged in (token exists)
  const isLoggedIn = localStorage.getItem("token");

  const navigationItems = [
    {
      path: "/home",
      label: "Dashboard",
      icon: Home,
      requiresAuth: true
    },
    {
      path: "/transactions",
      label: "Transactions",
      icon: CreditCard,
      requiresAuth: true
    },
    {
      path: "/budget",
      label: "Budget",
      icon: Target,
      requiresAuth: true
    },
    {
      path: "/charts",
      label: "Charts",
      icon: BarChart3,
      requiresAuth: true
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Navigation Header */}
      <div className="p-6 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-center">
          <div className="p-3 rounded-xl bg-blue-600 dark:bg-blue-500 shadow-md">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <span className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
              Navigation
            </span>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {isLoggedIn ? (
          <>
            {navigationItems
              .filter(item => !item.requiresAuth || isLoggedIn)
              .map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                      ${isActive
                        ? "bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 shadow-sm font-semibold"
                        : "hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      }
                      ${isCollapsed ? "justify-center" : ""}
                    `}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </Link>
                );
              })}
          </>
        ) : (
          <div className="space-y-2">
            <Link
              to="/login"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800 transition-all duration-300"
              onClick={() => setIsMobileOpen(false)}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">Login</span>}
            </Link>
            <Link
              to="/signup"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-300"
              onClick={() => setIsMobileOpen(false)}
            >
              <CreditCard className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">Sign Up</span>}
            </Link>
          </div>
        )}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-700 space-y-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`
            flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300
            bg-amber-100 dark:bg-blue-900 border border-amber-200 dark:border-blue-700
            hover:bg-amber-200 dark:hover:bg-blue-800
            text-amber-700 dark:text-blue-300 hover:text-amber-800 dark:hover:text-blue-200
            ${isCollapsed ? "justify-center" : ""}
          `}
          title="Toggle Theme"
        >
          {isDark ? (
            <Sun className="w-5 h-5 flex-shrink-0" />
          ) : (
            <Moon className="w-5 h-5 flex-shrink-0" />
          )}
          {!isCollapsed && (
            <span className="font-medium">
              {isDark ? "Light Mode" : "Dark Mode"}
            </span>
          )}
        </button>

        {/* Logout Button (only if logged in) */}
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300
              bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-700
              text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800
              hover:text-red-800 dark:hover:text-red-200
              ${isCollapsed ? "justify-center" : ""}
            `}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        )}

        {/* Collapse Toggle (Desktop only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`
            hidden lg:flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300
            bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600
            hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300
            hover:text-gray-800 dark:hover:text-gray-200
            ${isCollapsed ? "justify-center" : ""}
          `}
        >
          <Menu className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">Collapse</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-lg backdrop-blur-md bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 text-gray-700 dark:text-gray-300"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 backdrop-blur-sm bg-black/20"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40 shadow-lg
          bg-white dark:bg-slate-800
          border-r border-gray-200 dark:border-slate-700
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-20" : "w-64"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <SidebarContent />
      </aside>

      {/* Spacer for main content */}
      <div className={`hidden lg:block transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`} />
    </>
  );
};

export default Sidebar;
