import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Target, PiggyBank, TrendingUp, TrendingDown, Wallet, Save } from "lucide-react";
import Layout from "./Layout";
import PageHeader from "./PageHeader";

// Category Budget Goals Subcomponent
const CategoryBudgetGoals = ({ goals, setGoals }) => {
    const defaultCategories = ["Food", "Entertainment", "Utilities", "Travel", "Savings", "Others"];

    const handleChange = (category, value) => {
        const amount = parseInt(value) || 0;
        const updatedGoals = { ...goals, [category]: amount };
        setGoals(updatedGoals);
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");
            const categoryGoals = Object.entries(goals).map(([category, goal]) => ({
                category,
                goal: parseFloat(goal)  // Ensure the goal is a number
            }));

            const response = await axios.post(
                "http://localhost:3001/api/category-goals/set",
                { categoryGoals },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log(response.data);  // Log the response from the server
            alert("Category goals saved successfully!");
        } catch (error) {
            console.error("Failed to update category goals:", error.response?.data || error.message);
            alert(`Failed to update category goals: ${error.response?.data?.message || error.message}`);
        }
    };


    const totalBudget = Object.values(goals).reduce((sum, val) => sum + (parseInt(val) || 0), 0); // Ensure the value is a number

    return (
        <div className="mt-15 backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 p-8 rounded-3xl shadow-2xl w-full hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-2 rounded-xl backdrop-blur-md bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-white/30">
                    <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
                    Set Category-wise Budget Goals
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {defaultCategories.map((category) => (
                    <div key={category} className="flex flex-col gap-2">
                        <label className="text-base font-medium text-slate-700 dark:text-white">{category}</label>
                        <input
                            type="number"
                            min={0}
                            value={goals[category] || 0}
                            onChange={(e) => handleChange(category, e.target.value)}
                            className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white transition-all duration-300 hover:bg-white/30 dark:hover:bg-white/20"
                            placeholder="₹0"
                        />
                    </div>
                ))}
            </div>

            <div className="mt-6 text-center text-slate-600 dark:text-slate-300 text-lg font-medium">
                🧾 Total Category Budget: <span className="font-bold text-indigo-600 dark:text-indigo-400">₹{totalBudget}</span>
            </div>

            {/* Save Button */}
            <div className="mt-6 text-center">
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-3 backdrop-blur-md bg-gradient-to-r from-indigo-500/80 to-blue-500/80 border border-white/30 text-white rounded-xl shadow-lg hover:from-indigo-600/90 hover:to-blue-600/90 hover:scale-105 transition-all duration-300"
                >
                    <Save className="w-4 h-4" />
                    Save Goals
                </button>
            </div>
        </div>
    );
};

// Main Budget Component
const Budget = () => {
    const [budget, setBudget] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [goals, setGoals] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const token = localStorage.getItem("token");

                if (!token) {
                    window.location.href = "/login";
                    return;
                }

                const [summaryRes, goalsRes] = await Promise.all([
                    axios.get("http://localhost:3001/api/summary/summary", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }),
                    axios.get("http://localhost:3001/api/category-goals/", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }),
                ]);
                console.log(summaryRes.data);
                console.log(goalsRes.data);
                const { totalBudget, totalIncome, totalExpenses } = summaryRes.data;
                setBudget(totalBudget);
                setTotalIncome(totalIncome);
                setTotalExpenses(totalExpenses);
                const formattedGoals = (goalsRes.data.categoryGoals || []).reduce((acc, curr) => {
                    acc[curr.category] = curr.goal;
                    return acc;
                }, {});
                setGoals(formattedGoals);
            } catch (err) {
                console.error("Failed to fetch budget data:", err);
                if (err.response?.status === 401) {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                } else {
                    setError("Failed to fetch data. Please try again later.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const savings = budget - totalExpenses;
    const remainingBudget = budget - totalExpenses;
    const expensePercentage = Math.min((totalExpenses / budget) * 100, 100);

    if (loading) {
        return (
            <Layout>
                <div className="bg-gradient-to-b from-slate-50 to-white dark:from-[#0c0f1c] dark:to-[#1a1d2e] border border-slate-200 dark:border-slate-700 p-10 rounded-3xl shadow-xl flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-slate-600 dark:text-slate-400">Loading your budget data...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="bg-gradient-to-b from-slate-50 to-white dark:from-[#0c0f1c] dark:to-[#1a1d2e] border border-slate-200 dark:border-slate-700 p-10 rounded-3xl shadow-xl flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="text-red-500 text-4xl mb-4">⚠️</div>
                        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <PageHeader 
                title="Budget Management" 
                subtitle="Track your spending and manage your budget goals" 
                icon={Target}
                gradient="from-purple-600 via-pink-600 to-indigo-600"
            />
            <div className="backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 p-10 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-10 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300">
                {/* Left Section (Budget Snapshot) */}
                <div className="w-full md:w-2/3">
                    <div className="flex items-center justify-center gap-4 mb-12">
                        <div className="p-3 rounded-2xl backdrop-blur-md bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/30">
                            <PiggyBank className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                            Monthly Budget Snapshot
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-10">
                        {[{
                            label: "Budget", value: budget, color: "text-slate-900 dark:text-white", icon: Wallet
                        }, {
                            label: "Income", value: totalIncome, color: "text-green-600 dark:text-green-400", icon: TrendingUp
                        }, {
                            label: "Expenses", value: totalExpenses, color: "text-red-500 dark:text-red-400", icon: TrendingDown
                        }, {
                            label: "Savings", value: savings, color: "text-blue-600 dark:text-blue-400", icon: PiggyBank
                        }].map(({ label, value, color, icon: Icon }) => (
                            <div key={label}
                                className="backdrop-blur-xl bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10 p-6 rounded-2xl hover:bg-white/30 dark:hover:bg-white/10 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                            >
                                <div className="flex items-center justify-center mb-3">
                                    <Icon className={`w-6 h-6 ${color}`} />
                                </div>
                                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 font-medium mb-2">{label}</p>
                                <p className={`text-2xl font-bold ${color}`}>₹{value}</p>
                            </div>
                        ))}
                    </div>

                    <p className="text-center text-base text-slate-600 dark:text-slate-300 mb-6">
                        You've used <span className="font-semibold text-indigo-600 dark:text-indigo-400">₹{totalExpenses}</span> out of your
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400"> ₹{budget}</span> budget.
                    </p>

                    <div className="relative w-full bg-slate-200 dark:bg-slate-700 h-4 rounded-full overflow-hidden mb-8 shadow-sm">
                        <div
                            className={`h-full ${remainingBudget < 0 ? "bg-red-500" : "bg-indigo-500"} transition-all duration-700`}
                            style={{ width: `${expensePercentage}%` }}
                        ></div>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-600 dark:text-slate-300">
                            {expensePercentage.toFixed(0)}%
                        </span>
                    </div>

                    <div className="mt-6 backdrop-blur-xl bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10 p-6 rounded-xl text-center shadow-lg hover:bg-white/30 dark:hover:bg-white/10 transition-all duration-300">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">💡 Smart Tip</p>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Keep expenses under <span className="font-semibold text-indigo-600 dark:text-indigo-400">70%</span> of your budget for consistent savings!
                        </p>
                    </div>
                </div>

                {/* Right Section (Category Goals) */}
                <div className="w-full md:w-1/3 mt-6 md:mt-0">
                    <CategoryBudgetGoals goals={goals} setGoals={setGoals} />
                </div>
            </div>
        </Layout>
    );
};

export default Budget;
