import { Form, Modal, Button } from "react-bootstrap"
import { useRef, useEffect, useState } from "react"
import { useBudgets } from "../contexts/BudgetContext"

export default function EditBudgetModal({ show, budgetId, handleClose }) {

const {getBudgetById} = useBudgets();
const [selectedBudget, setSelectedBudget] = useState(null);

  // Fetch budget only when modal opens or budgetId changes
  useEffect(() => {
    if (budgetId && show) {
      getBudgetById(budgetId).then((response) => {
        setSelectedBudget({
          name: response.name,
          maxAmount: response.maxAmount
        })
      })
    }
  }, [budgetId, show]) // re-fetch if the modal opens for a different budget


  async function handleSubmit(e) {
    e.preventDefault();

  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Budget</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control value={selectedBudget?.name ?? ""} type="text" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="max">
            <Form.Label>Maximum Spending</Form.Label>
            <Form.Control  value={selectedBudget?.maxAmount ?? 0} type="number" required min={0} step={0.01}/>
          </Form.Group> */}
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
              value={selectedBudget?.maxAmount ?? 0}
              type="number"
              required
              min={0}
              step={0.01}
              onChange={(e) =>
                setSelectedBudget((prev) => ({
                  ...prev,
                  maxAmount: parseFloat(e.target.value) || 0,
                }))
              }
            />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit">Save</Button>
          </div>
        </Modal.Body>
      </Form>
    </Modal>
  )
}
