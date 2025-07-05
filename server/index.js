const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static files from public directory (built React app)
app.use(express.static('public'));

// Test Route for API health check
app.get("/api/health", (req, res) => {
  res.json({ status: "API running 🎯", timestamp: new Date().toISOString() });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/transactions", require("./routes/transactions"));
app.use("/api/budgets", require("./routes/budgets"));
app.use("/api/category-goals",require("./routes/categoryBudgetRoutes"));
app.use("/api/debts", require("./routes/debts")); 
app.use("/api/summary", require("./routes/summary"));     
app.use("/api/reminders", require("./routes/reminders")); // Added route for reminders

// Handle React routing, return all requests to React app
app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
