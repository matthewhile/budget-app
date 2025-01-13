import { Modal, Button, Stack } from "react-bootstrap"
import { UNCATEGORIZED_BUDGET_ID, useBudgets } from "../contexts/BudgetsContext"
import { currencyFormatter } from "../utils"

export default function ViewExpensesModal({ budgetId, handleClose }) {

  const { allBudgets, getBudgetExpenses } = useBudgets();
  
  //const budgetName = allBudgets.filter(b => b.Id === budgetId).map((b => b.BudgetName))
  const budget = allBudgets.find(b => b.Id === budgetId);
  const budgetName = budget ? budget.BudgetName : null;
  const expenses = getBudgetExpenses(budgetId)



 
//   const budget =
//     UNCATEGORIZED_BUDGET_ID === budgetId
//       ? { name: "Uncategorized", id: UNCATEGORIZED_BUDGET_ID }
//       : budgets.find(b => b.id === budgetId)

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
          {expenses.map(expense => (
            <Stack direction="horizontal" gap="2" key={expense.Id}>
              <div className="me-auto fs-4">{expense.Description}</div>
              <div className="fs-5">
                {currencyFormatter.format(expense.ExpenseAmount)}
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