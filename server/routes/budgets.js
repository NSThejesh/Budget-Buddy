const express = require("express");
const router = express.Router();
const {
  setCategoryGoal,
  getCategoryGoals,
  deleteCategoryGoal,
} = require("../controllers/budgetController");
const authMiddleware = require("../middleware/auth");

router.post("/set", authMiddleware, setCategoryGoal);
router.get("/", authMiddleware, getCategoryGoals);
router.delete("/:category", authMiddleware, deleteCategoryGoal);

module.exports = router;
