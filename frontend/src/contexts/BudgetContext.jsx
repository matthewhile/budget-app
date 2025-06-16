import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const BudgetsContext = React.createContext()

export function useBudgets() {
    return useContext(BudgetsContext)
}

export const BudgetsProvider = ({ children }) => {
    const [allBudgets, setAllBudgets] = useState([]);


    useEffect(() => {
        // Fetch all budgets
        axios.get("http://localhost:5023/api/budget")
            .then(response => setAllBudgets(response.data))
            .catch(error => console.error("Error fetching budgets:", error));

        // Fetch all expenses
    }, []);

    
    return (
    <BudgetsContext.Provider value={{
        allBudgets,
    }}>{children}</BudgetsContext.Provider>
  )
}
