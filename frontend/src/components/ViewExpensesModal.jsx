import { Modal, Button, Stack } from "react-bootstrap"
import { useBudgets } from "../contexts/BudgetContext"
import { currencyFormatter } from "../utils"
import { useEffect } from "react"

export default function ViewExpensesModal({ budgetId, handleClose }) {

  const { allBudgets, getBudgetExpenses, expensesByBudget } = useBudgets();
  
  useEffect(() => {
    if (budgetId != null && !expensesByBudget[budgetId]) {
      getBudgetExpenses(budgetId);
    }
  }, [budgetId]);


  const expenses = expensesByBudget[budgetId] || [];
  const budget = allBudgets.find(b => b.id === budgetId);
  const budgetName = budget ? budget.name : null;

  return (
    <Modal show={budgetId != null} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <Stack direction="horizontal" gap="2">
            
            <div>Expenses - {budgetName} 
            </div>
            {/* {budgetId !== UNCATEGORIZED_BUDGET_ID && (
              <Button
                onClick={() => {
                  deleteBudget(budget)
                  handleClose()
                }}
                variant="outline-danger"
                className="ms-5" 
              >
                Delete Budget     
              </Button>
            )} */}
          </Stack>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack direction="vertical" gap="3">
            {/* <div className="me-auto" gap="2">
                <span>Name</span>
                <span>Date</span>
                <span>Amount</span>
            </div> */}
            {expenses.map(expense => (
                <Stack direction="horizontal" gap="2" key={expense.id}>
                <div className="me-auto fs-4">{expense.description}</div>
                <div className="me-fixed fs-5">{expense.date}</div>
                <div className="fs-5">
                    {currencyFormatter.format(expense.amount)}
                </div>
                {/* <Button
                    onClick={() => deleteExpense(expense)}
                    size="sm"
                    variant="outline-danger"
                >
                    &times;
                </Button> */}
                </Stack>
            ))}
        </Stack>
      </Modal.Body>
    </Modal>
  )
}