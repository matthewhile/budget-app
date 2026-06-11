import { Form, Modal, Button, Alert } from "react-bootstrap"
import { useEffect, useState } from "react"
import { useBudgets } from "../contexts/BudgetContext"

export default function EditBudgetModal({ show, budgetId, handleClose }) {

const {updateBudget, getBudgetById, deleteBudget} = useBudgets();
const [selectedBudget, setSelectedBudget] = useState(null);
const [submitError, setSubmitError] = useState(null);
const [deleteError, setDeleteError] = useState(null);

  // Fetch existing budget data only when modal opens or budgetId changes
  useEffect(() => {
    if (budgetId && show) {
      getBudgetById(budgetId).then((data) => {
        setSelectedBudget({
          name: data.name,
          maxAmount: data.maxAmount
        })
      })
    }
  }, [budgetId, show]) 

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    setSubmitError(null)
    const budget = {
      name: selectedBudget?.name,
      maxAmount: selectedBudget?.maxAmount ?? 0
    }
    try {
      await updateBudget(budgetId, budget);
      handleClose();
    } catch {
      console.error("Error updating budget " + budget.id, error);
      setSubmitError("Failed to update budget. Please try again.")
    }
  }

  // const handleDeleteBudget = async () => {
  //   setDeleteError(null)
  //   try {
  //     await deleteBudget(budgetId);
  //     handleClose();
  //   } catch (error) {
  //     console.error("Failed to delete buget", error)
  //     setDeleteError("Something wen't wrong! Failed to delete budget.");
  //   }
  // }

  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={handleSaveBudget}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Budget - {selectedBudget?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={selectedBudget?.name ?? ""}
              type="text"
              required
              onChange={(e) =>
                setSelectedBudget((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="max">
            <Form.Label>Maximum Spending</Form.Label>
            <Form.Control
              value={selectedBudget?.maxAmount}
              type="number"
              required
              min={1}
              step={1}
              onChange={(e) =>
                setSelectedBudget((prev) => ({
                  ...prev, maxAmount: parseFloat(e.target.value)}))
              }
            />
          </Form.Group>
          {submitError && (<Alert variant="danger">{submitError}</Alert>)}
          <div className="d-flex justify-content-between">
            {/* <Button onClick={handleDeleteBudget} variant="outline-danger">Delete Budget</Button> */}
            <Button variant="primary" type="submit">Save</Button>
          </div>
          {deleteError && (<Alert variant="danger">{deleteError}</Alert>)}
        </Modal.Body>
      </Form>
    </Modal>
  )
}
