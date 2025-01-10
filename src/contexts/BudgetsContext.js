import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const BudgetsContext = React.createContext()

export function useBudgets() {
    return useContext(BudgetsContext)
}

export const BudgetsProvider = ({ children }) => {
    const [allBudgets, setAllBudgets] = useState([]);
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3001/budgets").then((response) => {
            setAllBudgets(response.data); 
        });
    }, []);

    function addExpense(newExpense) {
        setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
    }

    // Adds a new Budget to the state
    function addBudget(newBudget) {
        setAllBudgets((prevBudgets) => [...prevBudgets, newBudget]);
    }

    // Gets all expenses associated with the specified budget
    function getBudgetExpenses(budgetId) {
        if (!budgetId) {
            console.error("Invalid budgetId:", budgetId);
            return [];
        }
        return axios.get(`http://localhost:3001/expenses/${budgetId}`)
            .then((response) => {
                console.log("Expenses fetched for budgetId:", budgetId, response.data);
                setExpenses(response.data); // Return the fetched expenses
            })
            .catch((error) => {
                console.error("Error fetching budget expenses:", error);
                return []; // Return an empty array in case of error
            });
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