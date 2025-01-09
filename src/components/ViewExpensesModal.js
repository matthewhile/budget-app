import { Modal, Button, Stack } from "react-bootstrap"
import { UNCATEGORIZED_BUDGET_ID, useBudgets } from "../contexts/BudgetsContext"
import { currencyFormatter } from "../utils"
//import { use } from "../../server/routes/Expenses"

export default function ViewExpensesModal({ show, handleClose }) {

  const { expenses, allBudgets } = useBudgets();
 

  // const expenses = getBudgetExpenses(budgetId)
//   const budget =
//     UNCATEGORIZED_BUDGET_ID === budgetId
//       ? { name: "Uncategorized", id: UNCATEGORIZED_BUDGET_ID }
//       : budgets.find(b => b.id === budgetId)

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <Stack direction="horizontal" gap="2">
            <div>Expenses - {allBudgets.BudgetName}</div>
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
          {expenses.map((expense, key) => (
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