import React, { useEffect, useState } from "react";
import ExpenseChart from "./ExpenseChart";
import ExpenseCategoryChart from "./ExpenseCategoryChart";
import { motion } from "framer-motion";
import { BarChart3, PieChart, TrendingUp } from "lucide-react";
import Layout from "./Layout";
import PageHeader from "./PageHeader";
import axios from "axios";

const Charts = () => {
    const [transactions, setTransactions] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:3001/api/transactions", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
    
                const data = res.data;
                setTransactions(data);
    
                const income = data
                    .filter((t) => t.amount > 0)
                    .reduce((acc, t) => acc + t.amount, 0);
    
                const expense = data
                    .filter((t) => t.amount < 0)
                    .reduce((acc, t) => acc + t.amount, 0);
    
                setTotalIncome(income);
                setTotalExpense(Math.abs(expense));
            } catch (err) {
                console.error("Failed to fetch transactions:", err);
            }
        };
    
        fetchData();
    }, []);
    

    return (
        <Layout>
            <PageHeader 
                title="Analytics" 
                subtitle="Visual insights into your income and spending patterns" 
                icon={BarChart3}
                gradient="from-indigo-600 via-purple-600 to-pink-600"
            />
            <div className="rounded-3xl shadow-2xl backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 overflow-hidden p-6 sm:p-10 space-y-10 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg backdrop-blur-md bg-gradient-to-r from-green-500/20 to-red-500/20 border border-white/30">
                                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-[#1E2A45] dark:text-white">Income vs Expense</h3>
                        </div>
                        <ExpenseChart totalIncome={totalIncome} totalExpense={totalExpense} />
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg backdrop-blur-md bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/30">
                                <PieChart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-[#1E2A45] dark:text-white">Spending by Category</h3>
                        </div>
                        <ExpenseCategoryChart transactions={transactions} />
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
};

export default Charts;
