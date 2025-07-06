import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const BudgetsContext = React.createContext()

export function useBudgets() {
    return useContext(BudgetsContext)
}

export const BudgetsProvider = ({ children }) => {
    const [allBudgets, setAllBudgets] = useState([]);
    const [expensesByBudget, setExpensesByBudget] = useState({});



    useEffect(() => {
        // Fetch all budgets
        axios.get("http://localhost:5023/api/budget")
            .then(response => setAllBudgets(response.data))
            .catch(error => console.error("Error fetching budgets:", error));
    }, []);

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
                const newBudget = response.data;
                setAllBudgets(prevBudgets => [...prevBudgets, newBudget]);
            })
            .catch(error => console.error("Error adding budget:", error));
    }

    // Add a new expense
    function addExpense(newExpense) {
        axios.post("http://localhost:5023/api/expense", newExpense)
            .then(response => {
                const addedExpense = response.data;
                const budgetId = addedExpense.budgetId;

                setExpensesByBudget(prev => ({
                    ...prev,
                    [budgetId]: [...(prev[budgetId] || []), addedExpense]
                }));
            })
            .catch(error => console.error("Error adding expense:", error));
    }


    
    return (
    <BudgetsContext.Provider value={{
        allBudgets,
        expensesByBudget,
        getBudgetExpenses,
        addBudget,
        addExpense
    }}>{children}</BudgetsContext.Provider>
  )
}
