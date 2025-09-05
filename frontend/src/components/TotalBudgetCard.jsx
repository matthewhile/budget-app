import { useBudgets } from "../contexts/BudgetContext"
import BudgetCard from "./BudgetCard"

export default function TotalBudgetCard() {
    const { allBudgets } = useBudgets()
    const amount = allBudgets.reduce((total, budget) => total + budget.totalSpent, 0)
    const max = allBudgets.reduce((total, budget) => total + budget.maxAmount, 0)
    if (max === 0) return null
    
    return <BudgetCard amount={amount} name="Total" gray max={max} hideButtons />
}
