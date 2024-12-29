const express = require("express");
const router = express.Router();
const { Budgets } = require("../models");


router.get("/", async (req, res) => {
    const listOfBudgets = await Budgets.findAll();
    res.json(listOfBudgets);
});


router.post("/", async (req, res) => {
    const newBudget = {
        ...req.body,
        BudgetAmount: 0,
    }
        
    await Budgets.create(newBudget);
    res.json(newBudget);
});

module.exports = router;