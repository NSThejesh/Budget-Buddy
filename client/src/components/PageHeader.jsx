import React from "react";
import { Wallet } from "lucide-react";

const PageHeader = ({ title, subtitle, icon: Icon = Wallet, gradient = "from-blue-600 via-purple-600 to-indigo-600" }) => {
  return (
    <div className="backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 p-6 rounded-2xl shadow-lg mb-8 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300">
      {/* Budget Buddy Brand */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="p-2 rounded-xl backdrop-blur-md bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-white/30">
          <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className={`text-2xl font-extrabold tracking-tight bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
          Budget Buddy
        </h1>
      </div>
      
      {/* Page Title */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          {Icon && (
            <div className="p-2 rounded-lg backdrop-blur-md bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-white/30">
              <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          )}
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
