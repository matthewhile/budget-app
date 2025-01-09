const express = require("express");
const router = express.Router();
const { Budgets } = require("../models");


router.get("/", async (req, res) => {
    const budgets = await Budgets.findAll();
    res.json(budgets);
});


router.post("/", async (req, res) => {
    const budget = {
        ...req.body,
        BudgetAmount: 0,
    }
        
    await Budgets.create(budget);
    res.json(budget);
});

module.exports = router;