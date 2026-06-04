import React, { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../api/axiosClient"
import { useAuth } from "./AuthContext"


const BudgetsContext = React.createContext()

//export const UNCATEGORIZED_BUDGET_ID = 0;

export function useBudgets() {
    return useContext(BudgetsContext)
}

export const BudgetsProvider = ({ children }) => {
    const [allBudgets, setAllBudgets] = useState([]);
    const [expensesByBudget, setExpensesByBudget] = useState({});
    const { isAuthenticated } = useAuth();
    const [loadBudgetsError, setLoadBudgetsError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) return;
        axiosClient.get("/api/budget")
            .then(response => setAllBudgets(response.data))
            .catch(error => {
                console.error("Error fetching budgets:", error)
                setLoadBudgetsError("Failed to load budgets. Please try refreshing the page.");
            });
    }, [isAuthenticated]);

    // Get a specified budget
    function getBudgetById(budgetId) {
        return axiosClient
            .get(`/api/budget/budgetId/${budgetId}`)
            .then(response => response.data)
            .catch(error => console.error("Error fetching selected budget:", error));
    }

    // Get a specified budget's expenses
    function getBudgetExpenses(budgetId) {
        axiosClient.get(`/api/budget/budgetIdExpenses/${budgetId}`)
            .then(response => {
                setExpensesByBudget(prev => ({
                    ...prev,
                    [budgetId]: response.data
                }));
            })
            .catch(error => console.error("Error fetching expenses:", error));
    }

    // Add a new budget
    async function addBudget(newBudget) {
        const response = await axiosClient.post("/api/budget", newBudget)
        const addedBudget = response.data;
        setAllBudgets(prevBudgets => [...prevBudgets, addedBudget]);
    }

    // Update a budget
    async function updateBudget(id, budget) {
        const response = await axiosClient.patch(`/api/budget/${id}`, budget)
        const updatedBudget = response.data;
        setAllBudgets(prevBudgets =>
            prevBudgets.map(budget =>
                budget.id === id ? updatedBudget : budget
            )                    
        );
    }

    // Delete a budget
    async function deleteBudget(id) {
        const response = await axiosClient.delete(`/api/budget/${id}`)
        setAllBudgets(prev => prev.filter(b => b.id !== id));
        getBudgetExpenses(UNCATEGORIZED_BUDGET_ID);
    }

    // Add a new expense
    async function addExpense(newExpense) {
        const response = await axiosClient.post("/api/expense", newExpense);
        const updatedBudget = response.data;
        setExpensesByBudget(prev => ({
            ...prev, [updatedBudget.id]: updatedBudget.expenses
        }));
        setAllBudgets(prev => prev.map(b =>
            b.id === updatedBudget.id ? updatedBudget : b
        ));
    }

    // Delete an expense
    async function deleteExpense(expense) {
        const response = await axiosClient.delete(`/api/expense/${expense.id}`)
        const updatedBudget = response.data;
        setExpensesByBudget(prev => ({
            ...prev, [updatedBudget.id]: updatedBudget.expenses
        }));
        setAllBudgets(prev => prev.map(b =>
            b.id === updatedBudget.id ? updatedBudget : b
        ));
    }


    return (
    <BudgetsContext.Provider value={{
        allBudgets,
        expensesByBudget,
        loadBudgetsError,
        getBudgetExpenses,
        getBudgetById,
        addBudget,
        updateBudget,
        deleteBudget,
        addExpense,
        deleteExpense
    }}>{children}</BudgetsContext.Provider>
  )
}
