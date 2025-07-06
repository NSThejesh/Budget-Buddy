import React from "react";
import Sidebar from "./Sidebar";
import Footer from "./Footer"; 

const Layout = ({ children }) => {
    return (
<div className="min-h-screen 
bg-gray-50 dark:bg-slate-900
dark:text-gray-100 transition-colors duration-300 ease-in-out overflow-auto relative">
  
  <div className="relative z-10 flex">
    {/* Sidebar */}
    <Sidebar />
    
    {/* Main Content Area */}
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Main Content Container */}
      <main className="flex-1 p-6 lg:p-10">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  </div>
</div>
    );
};

export default Layout;
