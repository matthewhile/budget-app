import { Form, Modal, Button, Alert } from "react-bootstrap"
import { useRef, useState } from "react"
import { useBudgets } from "../contexts/BudgetContext"

export default function AddBudgetModal({ show, handleClose }) {
  const nameRef = useRef();
  const maxRef = useRef();
  const [submitError, setSubmitError] = useState(null); 
  const { addBudget } = useBudgets();

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError(null);
    const newBudget = {
      name: nameRef.current.value,  
      maxAmount: parseFloat(maxRef.current.value),
    };

    try {
      await addBudget(newBudget);
      handleClose();
    } 
    catch (error) {
      console.log(error)
      setSubmitError("Failed to add budget. Please try again.")
    }
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>New Budget</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control ref={nameRef} type="text" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="max">
            <Form.Label>Maximum Spending</Form.Label>
            <Form.Control ref={maxRef} type="number" required min={0} step={0.01}/>
          </Form.Group>
          {submitError && (
            <Alert variant="danger">{submitError}</Alert>
          )}          
          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit">Add</Button>
          </div>
        </Modal.Body>
      </Form>
    </Modal>
  )
}
