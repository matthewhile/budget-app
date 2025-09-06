import { Form, Modal, Button } from "react-bootstrap"
import { useRef, useState } from "react"
import { useBudgets} from "../contexts/BudgetContext"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"

export default function AddExpenseModal({ show, handleClose, defaultBudgetId }) {
  const descriptionRef = useRef()
  const amountRef = useRef()
  const budgetIdRef = useRef()

  const [selectedDate, setSelectedDate] = useState(new Date())
  const { addExpense, allBudgets } = useBudgets();
  
  async function handleSubmit(e) {
    e.preventDefault()
    const newExpense = {
      description: descriptionRef.current.value,
      amount: parseFloat(amountRef.current.value),
      date: selectedDate.toISOString().split("T")[0],
      budgetId: budgetIdRef.current.value
    }

    try {
      addExpense(newExpense);
      handleClose();     
    } 
    catch (error) {
      console.error("There was an error adding the expense!", error);
    }
    handleClose()  
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>New Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control ref={descriptionRef} type="text" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="amount">
            <Form.Label>Amount</Form.Label>
            <Form.Control ref={amountRef} type="number" required min={0} step={1} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="date">
            <Form.Label>Date</Form.Label>
            <div className="datepicker-wrapper">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                className="form-control"
                required
              />
            </div>
          </Form.Group>
          <Form.Group className="mb-3" controlId="budgetId">
            <Form.Label>Budget</Form.Label>
            <Form.Select defaultValue={defaultBudgetId} ref={budgetIdRef}>
                {allBudgets.map((budget)=> (
                    <option key={budget.id} value={budget.id}>
                      {budget.name}
                    </option>
                ))}
            </Form.Select>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit">
              Add
            </Button>
          </div>
        </Modal.Body>
      </Form>
    </Modal>
  )
}
