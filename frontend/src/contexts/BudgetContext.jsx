import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const BudgetsContext = React.createContext()

export function useBudgets() {
    return useContext(BudgetsContext)
}

export const BudgetsProvider = ({ children }) => {
    const [allBudgets, setAllBudgets] = useState([]);
    const [selectedBudget, setSelectedBudget] = useState(null);
    const [expensesByBudget, setExpensesByBudget] = useState({});


    // Get all budgets
    useEffect(() => {
        axios.get("http://localhost:5023/api/budget")
            .then(response => setAllBudgets(response.data))
            .catch(error => console.error("Error fetching budgets:", error));
    }, []);

    // Get a single budget
    function getBudgetById(budgetId) {
        axios.get(`http://localhost:5023/api/budget/budgetId/${budgetId}`)
            .then(response => setSelectedBudget(response.data))
            .catch(error => console.error("Error fetching selected budget:", error));
    }

    // Get a specific budget's expenses
    function getBudgetExpenses(budgetId) {
        axios.get(`http://localhost:5023/api/expense/budgetId/${budgetId}`)
            .then(response => {
                setExpensesByBudget(prev => ({
                    ...prev,
                    [budgetId]: response.data
                }));
            })
            .catch(error => console.error("Error fetching expenses:", error));
    }

    // Add a new budget
    function addBudget(newBudget) {
        axios.post("http://localhost:5023/api/budget", newBudget)
            .then(response => {
                const addedBudget = response.data;
                setAllBudgets(prevBudgets => [...prevBudgets, addedBudget]);
            })
            .catch(error => console.error("Error adding budget:", error));
    }

    // Add a new expense
    function addExpense(newExpense) {
        axios.post("http://localhost:5023/api/expense", newExpense)
            .then(response => {
                const { addedExpense, updatedBudget } = response.data;
                const budgetId = updatedBudget.id;
                setExpensesByBudget(prev => ({
                    ...prev,
                    [budgetId]: [...(prev[budgetId] || []), addedExpense]
                }));

                setAllBudgets(prev => prev.map(b =>
                    b.id === updatedBudget.id ? updatedBudget : b
                ));
            })
            .catch(error => console.error("Error adding expense:", error));
    }

    return (
    <BudgetsContext.Provider value={{
        allBudgets,
        selectedBudget,
        expensesByBudget,
        getBudgetExpenses,
        getBudgetById,
        addBudget,
        addExpense
    }}>{children}</BudgetsContext.Provider>
  )
}
