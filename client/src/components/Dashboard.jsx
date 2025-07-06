import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from "react";
import axios from "axios";
import {
    ArrowDownRight,
    ArrowUpRight,
    Wallet,
    Plus,
} from "lucide-react";
import AddTransaction from "./AddTransaction";
import ExpenseChart from "./ExpenseChart";
import BudgetGoalProgress from "./BudgetGoalProgress";
import DebtOverview from "./DebtOverview";
import NetWorthCard from "./NetWorthCard";
import Layout from "./Layout";
import PageHeader from "./PageHeader";

const Dashboard = () => {
    const [userId, setUserId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [budgetGoals, setBudgetGoals] = useState([]);
    const [debts, setDebts] = useState([]);
    const totalBalance = totalIncome - totalExpense;
    const budgetUsed = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;

    // Decode token and set userId
    const token = localStorage.getItem("token"); // or wherever you store it
    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);  // Decode the token
            setUserId(decodedToken.userId); // Set userId from the token
        }
    }, [token]);  // Runs only once when token is available

    // Fetch data once userId is available
    useEffect(() => {
        if (!userId || !token) return;

        const headers = {
            Authorization: `Bearer ${token}`
        };

        // Fetch the transaction summary
        axios.get("http://localhost:3001/api/summary/summary", { headers })
            .then(response => {
                const { totalIncome, totalExpenses } = response.data;
                setTotalIncome(totalIncome);
                setTotalExpense(totalExpenses); // Fix here
            })
            .catch(err => console.error("Summary Error:", err));

        // Fetch all transactions for the user
        axios.get("http://localhost:3001/api/transactions", { headers })
            .then(res => {
                setTransactions(res.data)
                console.log("Without setTransactions",res.data)
                console.log("With setTransactions ",transactions)
            })
            .catch(err => console.error("Transaction Error:", err));

        // Fetch budget goals for the user
        axios.get("http://localhost:3001/api/category-goals", { headers })
            .then(res => {
                setBudgetGoals(res.data.categoryGoals),
                console.log(res.data)
            })
            .catch(err => console.error("Budget Error:", err));

        // Fetch debts for the user
        axios.get("http://localhost:3001/api/debts", { headers })
            .then(res => setDebts(res.data))
            .catch(err => console.error("Debt Error:", err));

    }, [userId, token]); // Run effect when userId or token changes

    // Calculate total spent per category
    const calculateSpentPerCategory = (transactions) => {
        const spentPerCategory = {};
        transactions.forEach(tx => {
            if (spentPerCategory[tx.category]) {
                spentPerCategory[tx.category] += tx.amount;
            } else {
                spentPerCategory[tx.category] = tx.amount;
            }
        });
        return spentPerCategory;
    };

    // Merge budget goals with spent data
    const budgetGoalsWithSpent = budgetGoals.map(goal => {
        const spent = calculateSpentPerCategory(transactions)[goal.category] || 0;
        return {
            ...goal,
            spent
        };
    });
    console.log("Transactions for Expense Chart: ", transactions);
    
    return (
        <Layout>
            <PageHeader 
                title="Dashboard" 
                subtitle="Your complete financial overview at a glance" 
                icon={Wallet}
                gradient="from-green-600 via-blue-600 to-purple-600"
            />
            <div className={`p-4 lg:p-8 transition-all duration-500 ease-in-out relative ${showModal ? "blur-sm pointer-events-none" : ""} 
                bg-white dark:bg-slate-800
                text-slate-800 dark:text-white rounded-3xl shadow-lg border border-gray-200 dark:border-slate-700`}>

                {/* Top Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[{
                        title: "Total Balance",
                        amount: totalBalance,
                        icon: <Wallet className="w-8 h-8 text-green-500" />,
                        textColor: totalBalance >= 0 ? "text-green-600" : "text-red-500",
                    }, {
                        title: "Total Income",
                        amount: totalIncome,
                        icon: <ArrowUpRight className="w-8 h-8 text-blue-600" />,
                        textColor: "text-blue-600",
                    }, {
                        title: "Total Expense",
                        amount: totalExpense,
                        icon: <ArrowDownRight className="w-8 h-8 text-red-500" />,
                        textColor: "text-red-500",
                    }].map(({ title, amount, icon, textColor }, idx) => (
                        <div key={idx} className="p-6 rounded-2xl bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 shadow-lg transform hover:scale-[1.05] hover:bg-gray-100 dark:hover:bg-slate-600 transition-all duration-300 ease-in-out">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold">{title}</h3>
                                {icon}
                            </div>
                            <p className={`text-3xl font-bold ${textColor}`}>
                                ₹{amount !== undefined && amount !== null ? amount.toLocaleString() : "0"}
                            </p>
                        </div>
                    ))}
                    <NetWorthCard income={totalIncome} expense={totalExpense} />
                </div>

                {/* Budget Progress */}
                <div className="flex flex-col space-y-4 mt-16">
                    <h4 className="text-xl font-semibold">Monthly Budget Usage</h4>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
                        <div className="bg-blue-500 h-4 transition-all duration-700 ease-out" style={{ width: `${budgetUsed}%` }} />
                    </div>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        ₹{totalExpense !== undefined && totalExpense !== null ? totalExpense.toLocaleString() : "0"} spent out of ₹{totalIncome !== undefined && totalIncome !== null ? totalIncome.toLocaleString() : "0"}
                    </p>
                </div>

                {/* Budget Goals & Expense Chart */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col space-y-4">
                        <h4 className="text-xl font-semibold">Budget Goals</h4>
                        <BudgetGoalProgress goals={budgetGoalsWithSpent} />
                    </div>
                    <div className="flex flex-col space-y-4">
                        <h4 className="text-xl font-semibold">Expense Chart</h4>
                        <ExpenseChart totalIncome={totalIncome} totalExpense={totalExpense} />
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="mt-16">
                    <h4 className="text-xl font-semibold mb-6">Recent Transactions</h4>
                    <ul className="space-y-4">
                        {transactions.slice(0, 3).map((tx, idx) => (
                            <li key={idx} className="flex justify-between items-center text-sm bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 px-6 py-4 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-all duration-200">
                                <span className="font-semibold">{tx.category}</span>
                                <span className={tx.amount > 0 ? "text-green-500" : "text-red-500"}>
                                    ₹{tx.amount !== undefined && tx.amount !== null ? tx.amount.toLocaleString() : "0"}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Savings */}
                <div className="mt-16">
                    <h4 className="text-xl font-semibold mb-4">Savings This Month</h4>
                    <p className="text-4xl font-extrabold text-green-600">
                        ₹{(totalIncome - totalExpense) !== undefined && (totalIncome - totalExpense) !== null ? (totalIncome - totalExpense).toLocaleString() : "0"}
                    </p>
                </div>

                {/* Debt Overview */}
                <DebtOverview debts={debts} />
            </div>

            {/* Floating Add Button */}
            <button onClick={() => setShowModal(true)} className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-full shadow-xl z-50 hover:scale-110 transition-all duration-300">
                <Plus className="w-8 h-8" />
            </button>

            {/* Modal for Add Transaction */}
            {showModal && userId && (
                <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-6" onClick={() => setShowModal(false)}>
                    <div className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                        <AddTransaction userId={userId} onSuccess={() => setShowModal(false)} />
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Dashboard;
