import BudgetCard from './BudgetCard'
import { useEffect } from "react"
import { useBudgets } from '../contexts/BudgetContext'

export default function UncategorizedBudgetCard(props) {
    const { uncategorizedBudget, getBudgetExpenses, expensesByBudget } = useBudgets()

    useEffect(() => {
        if (uncategorizedBudget?.id != null) {
            getBudgetExpenses(uncategorizedBudget.id);
        }
    }, [uncategorizedBudget?.id]);

    const expenses = expensesByBudget[uncategorizedBudget?.id] || [];
    const amount = expenses.reduce((total, expense) => total + expense.amount, 0);

    if (amount === 0) return null

    return <BudgetCard amount={amount} name="Uncategorized" gray {...props} />
}


