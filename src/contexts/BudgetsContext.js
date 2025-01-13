import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const BudgetsContext = React.createContext()

export function useBudgets() {
    return useContext(BudgetsContext)
}

export const BudgetsProvider = ({ children }) => {
    const [allBudgets, setAllBudgets] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [newData, setNewData] = useState(false);

    useEffect(() => {
        // Fetch all budgets
        axios.get("http://localhost:3001/budgets")
            .then(response => setAllBudgets(response.data))
            .catch(error => console.error("Error fetching budgets:", error));

        // Fetch all expenses
        axios.get("http://localhost:3001/expenses")
            .then(response => setExpenses(response.data))
            .catch(error => console.error("Error fetching expenses:", error));
    }, [newData]);

    // Add a new expense 
    function addExpense(newExpense) {
        setExpenses((prevExpenses) => [...prevExpenses, newExpense]); // Optimistic update
        axios.post("http://localhost:3001/expenses", newExpense)
            .then(() => setNewData(prev => !prev))
            .catch(error => console.error("Error adding expense:", error));
    }
    
    // Add a new budget
    function addBudget(newBudget) {
        setAllBudgets((prevBudgets) => [...prevBudgets, newBudget]); // Optimistic update
        axios.post("http://localhost:3001/budgets", newBudget)
            .then(() => setNewData(prev => !prev))
            .catch(error => console.error("Error adding budget:", error));
    }
    
    // Get all expenses for a specific budget
    function getBudgetExpenses(budgetId) {
        return expenses.filter(expense => expense.BudgetId === budgetId);
    }

    
    return (
    <BudgetsContext.Provider value={{
        allBudgets,
        expenses,
        addBudget,
        addExpense,
        getBudgetExpenses
    }}>{children}</BudgetsContext.Provider>
  )
}