import BudgetCard from './BudgetCard'
import { useEffect } from "react"
import { UNCATEGORIZED_BUDGET_ID, useBudgets } from '../contexts/BudgetContext'

export default function UncategorizedBudgetCard(props) {
    const { getBudgetExpenses, expensesByBudget } = useBudgets()

    useEffect(() => {
    if (UNCATEGORIZED_BUDGET_ID != null) {
      getBudgetExpenses(UNCATEGORIZED_BUDGET_ID);
    }
    }, [UNCATEGORIZED_BUDGET_ID]);

    const expenses = expensesByBudget[UNCATEGORIZED_BUDGET_ID] || [];
    // const amount = getBudgetExpenses(UNCATEGORIZED_BUDGET_ID).reduce(
    //     (total, expense) => total + expense.amount, 0
    // )
    // if (amount === 0) return null

    return <BudgetCard amount={expenses.amount} name="Uncategorized" gray {...props} />
}


