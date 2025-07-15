import { Form, Modal, Button } from "react-bootstrap"
import { useRef } from "react"
import { useBudgets } from "../contexts/BudgetContext"

export default function EditBudgetModal({ show, budgetId, handleClose }) {

const {selectedBudget, getSelectedBudget} = useBudgets();

// if (budgetId != null) {
//   getSelectedBudget(budgetId);
// }

// budgetName = selectedBudget.name;
// budgetMax = selectedBudget.maxAmount;


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
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control /*ref={nameRef}*/ type="text" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="max">
            <Form.Label>Maximum Spending</Form.Label>
            <Form.Control /*ref={maxRef}*/ type="number" required min={0} step={0.01}/>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit">Save</Button>
          </div>
        </Modal.Body>
      </Form>
    </Modal>
  )
}
