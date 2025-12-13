import React, { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../api/axiosClient"


const BudgetsContext = React.createContext()

export const UNCATEGORIZED_BUDGET_ID = 1;

export function useBudgets() {
    return useContext(BudgetsContext)
}

export const BudgetsProvider = ({ children }) => {
    const [allBudgets, setAllBudgets] = useState([]);
    const [expensesByBudget, setExpensesByBudget] = useState({});


    // Get all budgets
    // useEffect(() => {
    //     axiosClient.get("/api/budget")
    //         .then(response => setAllBudgets(response.data))
    //         .catch(error => console.error("Error fetching budgets:", error));
    // }, []);

    function getAllBudgets() {
        axiosClient.get("/api/budget")
             .then(response => setAllBudgets(response.data))
             .catch(error => console.error("Error fetching budgets:", error));
    }

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
    function addBudget(newBudget) {
        axiosClient.post("/api/budget", newBudget)
            .then(response => {
                const addedBudget = response.data;
                setAllBudgets(prevBudgets => [...prevBudgets, addedBudget]);
            })
            .catch(error => console.error("Error adding budget:", error));
    }

    // Update a budget
    function updateBudget(id, budget) {
        axiosClient.patch(`/api/budget/${id}`, budget)
            .then(response => {
                const updatedBudget = response.data;
                setAllBudgets(prevBudgets =>
                    prevBudgets.map(budget =>
                        budget.id === id ? updatedBudget : budget
                    )                    
                );
            })
            .catch(error => console.error("Error updating budget " + budget.id, error));
    }

    // Delete a budget
    function deleteBudget(id) {
        axiosClient.delete(`/api/budget/${id}`)
            .then(() => {
                setAllBudgets(prev => prev.filter(b => b.id !== id));
                getBudgetExpenses(UNCATEGORIZED_BUDGET_ID);
                })
            .catch(error => console.error("Error deleting budget:", error));
    }


    // Add a new expense
    function addExpense(newExpense) {
        axiosClient.post("/api/expense", newExpense)
            .then(response => {
                const updatedBudget = response.data;
                setExpensesByBudget(prev => ({
                    ...prev, [updatedBudget.id]: updatedBudget.expenses
                }));

                setAllBudgets(prev => prev.map(b =>
                    b.id === updatedBudget.id ? updatedBudget : b
                ));
            })
            .catch(error => console.error("Error adding expense:", error));
    }

    // Delete an expense
    function deleteExpense(expense) {
        axiosClient.delete(`/api/expense/${expense.id}`)
            .then(response => {
                const updatedBudget = response.data;
                setExpensesByBudget(prev => ({
                    ...prev, [updatedBudget.id]: updatedBudget.expenses
                }));

                setAllBudgets(prev => prev.map(b =>
                    b.id === updatedBudget.id ? updatedBudget : b
                ));
            })
            .catch(error => console.error("Error deleting expense:", error));
    }

    return (
    <BudgetsContext.Provider value={{
        allBudgets,
        expensesByBudget,
        getAllBudgets,
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
