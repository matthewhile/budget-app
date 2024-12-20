const express = require("express");
const router = express.Router();
const { Budgets } = require("../models");

// Example GET route
router.get("/", async (req, res) => {
    const listOfBudgets = await Budgets.findAll();
    res.json(listOfBudgets);
});

// Example POST route
router.post("/", async (req, res) => {
    const newBudget = req.body;
    await Budgets.create(newBudget);
    res.json(newBudget);
});

module.exports = router;