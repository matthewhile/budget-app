import { useBudgets } from "../contexts/BudgetContext"
import BudgetCard from "./BudgetCard"

export default function TotalBudgetCard() {
    const { budgets } = useBudgets()
    budgets.forEach(budget => {
        console.log(budget.name, budget.totalSpent)
    })
    const amount = budgets.reduce((total, budget) => total + budget.totalSpent, 0)
    const max = budgets.reduce((total, budget) => total + budget.maxAmount, 0)
    if (max === 0) return null
    
    return <BudgetCard amount={amount} name="Total" gray max={max} hideButtons />
}
