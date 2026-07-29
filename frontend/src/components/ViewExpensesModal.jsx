import { Modal, Button, Alert, Table } from "react-bootstrap"
import { useBudgets } from "../contexts/BudgetContext"
import { currencyFormatter } from "../utils"
import { useEffect, useState } from "react"
import { formatDate } from "../utils"

export default function ViewExpensesModal({ budgetId, handleClose }) {

  const { budgets, getBudgetExpenses, deleteExpense, expensesByBudget } = useBudgets();
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    if (budgetId != null) {
      getBudgetExpenses(budgetId);
    }
  }, [budgetId]);

  const expenses = expensesByBudget[budgetId] || [];

  const hasNoExpenses = expenses.length === 0;
  const budget = budgets.find(b => b.id === budgetId);
  const budgetName = budget ? budget.name : null;

  const handleDeleteExpense = async (expense) => {
    setDeleteError(null);
    try {
      await deleteExpense(expense);
    } catch (error) {
        console.log(error);
        setDeleteError("Something wen't wrong! Failed to delete expense.");
    }
  }

  return (
    <Modal show={budgetId != null} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{budgetName} Expenses</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {hasNoExpenses ? (
          <p className="text-muted text-center my-3">No expenses for this budget.</p>
        ) : (
          <Table hover responsive className="mb-0 table-striped">
            <thead className="table-success">
              <tr>
                <th>Description</th>
                <th className="text-center">Amount</th>
                <th className="text-end">Date</th>
                <th style={{ width: "2rem" }}></th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(expense => (
                <tr key={expense.id}>
                  <td className="align-middle">{expense.description}</td>
                  <td className="align-middle text-center fw-semibold">{currencyFormatter.format(expense.amount)}</td>
                  <td className="align-middle text-end text-muted">{formatDate(expense.date)}</td>
                  <td className="align-middle text-center">
                    <Button
                      onClick={() => handleDeleteExpense(expense)}
                      size="sm"
                      variant="outline-danger"
                    >
                      &times;
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        {deleteError && <Alert variant="danger" className="mt-3 mb-0">{deleteError}</Alert>}
      </Modal.Body>
    </Modal>
  )
}
