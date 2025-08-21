import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const BudgetsContext = React.createContext()

export const UNCATEGORIZED_BUDGET_ID = 1;

export function useBudgets() {
    return useContext(BudgetsContext)
}

export const BudgetsProvider = ({ children }) => {
    const [allBudgets, setAllBudgets] = useState([]);
    const [expensesByBudget, setExpensesByBudget] = useState({});


    // Get all budgets
    useEffect(() => {
        axios.get("http://localhost:5023/api/budget")
            .then(response => setAllBudgets(response.data))
            .catch(error => console.error("Error fetching budgets:", error));
    }, []);

    // Get a specified budget
    function getBudgetById(budgetId) {
        return axios
            .get(`http://localhost:5023/api/budget/budgetId/${budgetId}`)
            .then(response => response.data)
            .catch(error => console.error("Error fetching selected budget:", error));
    }

    // Get a specified budget's expenses
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

    // Update a budget
    function updateBudget(id, budget) {
        axios.patch(`http://localhost:5023/api/budget/${id}`, budget)
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

    // Add a new expense
    function addExpense(newExpense) {
        axios.post("http://localhost:5023/api/expense", newExpense)
            .then(response => {
                const updatedBudget = response.data;
                //const budgetId = updatedBudget.id;
                setExpensesByBudget(prev => ({
                    ...prev, [updateBudget.id]: updateBudget.expenses
                }));

                setAllBudgets(prev => prev.map(b =>
                    b.id === updatedBudget.id ? updatedBudget : b
                ));
            })
            .catch(error => console.error("Error adding expense:", error));
    }

    // Delete an expense
    function deleteExpense(expense) {
        axios.delete(`http://localhost:5023/api/expense/${expense.id}`)
            .then(response => {
                debugger;
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
        getBudgetExpenses,
        getBudgetById,
        addBudget,
        updateBudget,
        addExpense,
        deleteExpense
    }}>{children}</BudgetsContext.Provider>
  )
}
