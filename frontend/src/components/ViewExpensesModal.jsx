import { Modal, Button, Stack } from "react-bootstrap"
import { useBudgets } from "../contexts/BudgetContext"
import { currencyFormatter } from "../utils"
import { useEffect } from "react"

export default function ViewExpensesModal({ budgetId, handleClose }) {

  const { allBudgets, getBudgetExpenses, expensesByBudget } = useBudgets();
  
//   const budget = allBudgets.find(b => b.Id === budgetId);
//   const budgetName = budget ? budget.BudgetName : null;
  useEffect(() => {
    if (budgetId != null) {
      getBudgetExpenses(budgetId);
    }
  }, [budgetId]);

  const expenses = expensesByBudget[budgetId] || [];

  return (
    <Modal show={budgetId != null} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <Stack direction="horizontal" gap="2">
            
            <div>Expenses
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
          {expenses.map(expense => (
            <Stack direction="horizontal" gap="2" key={expense.id}>
              <div className="me-auto fs-4">{expense.description}</div>
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