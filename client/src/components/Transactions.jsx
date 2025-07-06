import React, { useEffect, useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, CreditCard, Search, Filter } from "lucide-react";
import TransactionReminders from "./TransactionReminders";
import Layout from "./Layout";
import PageHeader from "./PageHeader";
import { getTransactions } from "../api/api";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const transactionsData = await getTransactions(); // No userId
      setTransactions(transactionsData);
    } catch (error) {
      setError("Error fetching transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const filteredTransactions = transactions.filter((txn) => {
    return (
      (!filter || txn.category === filter) &&
      txn.title.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalSpent = filteredTransactions
    .filter((txn) => txn.amount < 0)
    .reduce((sum, txn) => sum + txn.amount, 0);

  const totalIncome = filteredTransactions
    .filter((txn) => txn.amount > 0)
    .reduce((sum, txn) => sum + txn.amount, 0);

  const net = totalIncome + totalSpent;

  return (
    <Layout>
      <PageHeader 
        title="Transactions" 
        subtitle="View and manage all your financial transactions" 
        icon={CreditCard}
        gradient="from-blue-600 via-cyan-600 to-purple-600"
      />
      <div className="backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl transition-all duration-500">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          {/* LEFT SIDE */}
          <div className="flex flex-col">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="w-full pl-10 pr-5 py-3 rounded-xl backdrop-blur-md bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 transition-all duration-300 hover:bg-white/30 dark:hover:bg-white/20"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="relative w-full sm:w-60">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                <select
                  className="w-full pl-10 pr-5 py-3 rounded-xl backdrop-blur-md bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800 dark:text-white transition-all duration-300 hover:bg-white/30 dark:hover:bg-white/20 appearance-none"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                <option value="">All Categories</option>
                <option value="Food">Food</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Travel">Travel</option>
                <option value="Utilities">Utilities</option>
                <option value="Income">Income</option>
                <option value="Others">Others</option>
                </select>
              </div>
            </div>

            {loading && <p>Loading transactions...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {filteredTransactions.length === 0 ? (
              <p className="text-center text-slate-500 dark:text-slate-400 italic mt-8">
                No transactions found.
              </p>
            ) : (
              <ul className="space-y-5 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent hover:scrollbar-thumb-purple-400 dark:hover:scrollbar-thumb-purple-500 transition-all duration-300 overflow-x-hidden">
                {filteredTransactions.map((txn) => (
                  <li
                    key={txn._id}
                    className="flex items-center justify-between backdrop-blur-xl bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-2xl px-6 py-4 shadow-lg hover:bg-white/30 dark:hover:bg-white/10 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out"
                  >
                    <div className="flex items-center gap-4">
                      {txn.amount < 0 ? (
                        <ArrowDownCircle className="text-red-500" size={26} />
                      ) : (
                        <ArrowUpCircle className="text-green-500" size={26} />
                      )}
                      <div>
                        <p className="text-lg font-semibold text-slate-800 dark:text-white">
                          {txn.title}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {txn.category}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`text-xl font-bold tracking-wide drop-shadow-sm ${txn.amount < 0 ? "text-red-500" : "text-green-500"
                        }`}
                    >
                      ₹{txn.amount}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col gap-8">
            <div className="backdrop-blur-xl bg-white/10 dark:bg-white/5 p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 h-fit transition-all duration-300 hover:bg-white/20 dark:hover:bg-white/10">
              <h3 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
                Summary:{" "}
                <span className="text-purple-600 dark:text-purple-400">
                  {filter || "All Categories"}
                </span>
              </h3>
              <ul className="space-y-4 text-slate-700 dark:text-slate-300 text-base leading-relaxed">
                <li>
                  <span className="font-semibold">🧾 Total Transactions:</span>{" "}
                  {filteredTransactions.length}
                </li>
                <li>
                  <span className="font-semibold">💸 Total Spent:</span> ₹{Math.abs(totalSpent)}
                </li>
                <li>
                  <span className="font-semibold">💰 Total Income:</span> ₹{totalIncome}
                </li>
                <li>
                  <span className="font-semibold">🔴 Net Balance:</span> ₹{net}
                </li>
              </ul>
            </div>

            <TransactionReminders />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Transactions;
