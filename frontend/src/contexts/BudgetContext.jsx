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
        axios.get(`http://localhost:5023/api/expense/${budgetId}`)
            .then(response => {
                setExpensesByBudget(prev => ({
                    ...prev,
                    [budgetId]: response.data
                }));
            })
            .catch(error => console.error("Error fetching expenses:", error));
    }

    
    return (
    <BudgetsContext.Provider value={{
        allBudgets,
        expensesByBudget,
        getBudgetExpenses
    }}>{children}</BudgetsContext.Provider>
  )
}
