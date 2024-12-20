import './App.css';
import axios from "axios";
import { useEffect, useState } from 'react';
import { Button, Stack } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import BudgetCard from "./components/BudgetCard";
import AddBudgetModal from "./components/AddBudgetModal";

function App() {

    const [allBudgets, setAllBudgets] = useState([]);
    const [showAddBudgetModal, setShowAddBudgetModal] = useState(false)

    useEffect(() => {
        axios.get("http://localhost:3001/budgets").then((response) => {
            setAllBudgets(response.data); 
        });
    }, [])

    // function addBudget(newBudget) {
    //     axios.post("http://localhost:3001/budgets", newBudget)
    //       .then((response) => {
    //         // Update the state to include the new budget
    //         setAllBudgets(prevBudgets => [...prevBudgets, response.data]);
    //       })
    //       .catch(error => {
    //         console.error("Error adding budget:", error);
    //       });
    //   }


    return (
        <>
            <Container className="my-4">
                <Stack direction="horizontal" gap="2" className="mb-4">
                        <h1 className="me-auto">Budgets</h1>
                    <Button variant="primary" onClick={() => setShowAddBudgetModal(true)}>Add Budget</Button>
                    <Button variant="outline-primary">Add Expense</Button>
                </Stack>
                <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "1rem",
                    alignItems: "flex-start",
                }}           
                >
                    <div className="App"> 
                    {" "}
                        {allBudgets.map((value, key) => (
                            <BudgetCard
                                key={key} 
                                name={value.BudgetName}      // Passing budget name
                                amount={value.ExpenseAmount}  // Passing budget amount
                                max={value.Max}        // Passing max amount
                            >
                            </BudgetCard>
                    ))} 
                    </div>
                </div>
            </Container>
            <AddBudgetModal
                show={showAddBudgetModal}
                handleClose={() => setShowAddBudgetModal(false)}
            />
      </>           
   )
}

export default App;
