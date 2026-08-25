import React, { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../api/axiosClient"
import { useAuth } from "./AuthContext"


const BudgetsContext = React.createContext()

export function useBudgets() {
    return useContext(BudgetsContext)
}

export const BudgetsProvider = ({ children }) => {
    const [budgets, setBudgets] = useState([]);
    const [currentPeriod, setCurrentPeriod] = useState(null);
    const [expensesByBudget, setExpensesByBudget] = useState({});
    const [defaultBudgets, setDefaultBudgets] = useState([]);
    const { isAuthenticated } = useAuth();
    const [loadBudgetsError, setLoadBudgetsError] = useState(null);

    const uncategorizedBudget = budgets.find(b => b.isSystem);

    async function loadBudgets(month, year) {
        try {
            const response = await axiosClient.get("/api/budget", { params: { month, year } });
            setCurrentPeriod(response.data.timePeriod);
            setBudgets(response.data.budgets);
        } catch (error) {
            console.error("Error fetching budgets:", error);
            setLoadBudgetsError("Failed to load budgets. Please try refreshing the page.");
        }
    }

    useEffect(() => {
        if (!isAuthenticated) return;
        const now = new Date();
        loadBudgets(now.getMonth() + 1, now.getFullYear());
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
        const response = await axiosClient.post("/api/budget", {
            ...newBudget,
            timePeriodId: currentPeriod?.id
        });
        const addedBudget = response.data;
        setBudgets(prevBudgets => [...prevBudgets, addedBudget]);
    }

    // Update a budget
    async function updateBudget(id, budget) {
        const response = await axiosClient.patch(`/api/budget/${id}`, budget)
        const updatedBudget = response.data;
        setBudgets(prevBudgets =>
            prevBudgets.map(budget =>
                budget.id === id ? updatedBudget : budget
            )
        );
    }

    // Delete a budget
    async function deleteBudget(id) {
        const response = await axiosClient.delete(`/api/budget/${id}`)
        setBudgets(prev => prev.filter(b => b.id !== id));
        getBudgetExpenses(uncategorizedBudget?.id);
    }

    // Add a new expense
    async function addExpense(newExpense) {
        const response = await axiosClient.post("/api/expense", newExpense);
        const updatedBudget = response.data;
        setExpensesByBudget(prev => ({
            ...prev, [updatedBudget.id]: updatedBudget.expenses
        }));
        setBudgets(prev => prev.map(b =>
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
        setBudgets(prev => prev.map(b =>
            b.id === updatedBudget.id ? updatedBudget : b
        ));
    }

    // Get the user's available budget names and which are currently saved as defaults
    async function loadDefaultBudgets() {
        const response = await axiosClient.get("/api/budget/default");
        setDefaultBudgets(response.data);
    }

    // Replace the user's saved default budgets with the given selection
    async function syncDefaultBudgets(selected) {
        const response = await axiosClient.put("/api/budget/default", selected);
        setDefaultBudgets(response.data);
    }


    return (
    <BudgetsContext.Provider value={{
        budgets,
        currentPeriod,
        uncategorizedBudget,
        expensesByBudget,
        defaultBudgets,
        loadBudgetsError,
        setLoadBudgetsError,
        loadBudgets,
        getBudgetExpenses,
        getBudgetById,
        addBudget,
        updateBudget,
        deleteBudget,
        addExpense,
        deleteExpense,
        loadDefaultBudgets,
        syncDefaultBudgets
    }}>{children}</BudgetsContext.Provider>
  )
}
