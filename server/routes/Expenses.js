const express = require("express");
const router = express.Router();
const { Expenses } = require("../models");


router.get("/:budgetId", async (req, res) => {
    const budgetId = req.params.budgetId;
    console.log("Received budgetId:", budgetId); // Log budgetId
    const expenses = await Expenses.findAll({ where: { BudgetId: budgetId} });
    res.json(expenses);
});

// router.get("/", async (req, res) => {
//     const expenses = await Expenses.findAll();
//     res.json(expenses);
// });


router.post("/", async (req, res) => {
    const expense = req.body;
    await Expenses.create(expense);
    res.json(expense);
});

module.exports = router;