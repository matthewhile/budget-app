import { Form, Modal, Button } from "react-bootstrap"
import { useRef } from "react"
import axios from "axios"

// export default function AddBudgetModal({ show, handleClose }) {
//   const nameRef = useRef()
//   const maxRef = useRef()

//   // function handleSubmit(e) {
//   //   e.preventDefault()
//   //   // addBudget({
//   //   //   name: nameRef.current.value,
//   //   //   max: parseFloat(maxRef.current.value),
//   //   // })
//   //   handleClose()  
//   // }

//   const handleSubmit = (data) => {
//     axios.post("http://localhost:3001/budgets", data).then((response) => {
//       //setAllBudgets(response.data);
//       console.log("It worked!")
//     });
//   };

export default function AddBudgetModal({ show, handleClose }) {
  const nameRef = useRef();
  const maxRef = useRef();

  async function handleSubmit(e) {
    e.preventDefault();

    // Construct new budget data from form inputs
    const newBudget = {
      BudgetName: nameRef.current.value,  
      Max: parseFloat(maxRef.current.value),
    };

    try {
      // Send POST request to add a new budget to the server
      await axios.post("http://localhost:3001/budgets", newBudget);

      // Close modal after successful submission
      handleClose();
    } catch (error) {
      console.error("There was an error adding the budget!", error);
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
            <Form.Control 
              ref={maxRef}
              type="number" 
              required 
              min={0} 
              step={0.01} 
            />
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
