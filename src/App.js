import './App.css';
import { useEffect, useState } from 'react';
import { Button, Stack } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import BudgetCard from "./components/BudgetCard";
import AddBudgetModal from "./components/AddBudgetModal";
import ViewExpensesModal from "./components/ViewExpensesModal"
//import AddExpenseModal from "./components/AddExpenseModal";
import { useBudgets } from "./contexts/BudgetsContext";

function App() {
    
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false)
    const [showAddBudgetModal, setShowAddBudgetModal] = useState(false)
    //const [addExpenseModalBudgetId, setAddExpenseModalBudgetId] = useState()
    const [viewExpensesModal, setViewExpensesModal] = useState()
    const { allBudgets, getBudgetExpenses } = useBudgets();


    // function openAddExpenseModal(budgetId) {
    //     setShowAddExpenseModal(true)
    //     setAddExpenseModalBudgetId(budgetId)
    //   }

    return (
        <>
            <Container className="my-4">
                <Stack direction="horizontal" gap="2" className="mb-4">
                        <h1 className="me-auto">Budgets</h1>
                    <Button variant="primary" onClick={() => setShowAddBudgetModal(true)}>Add Budget</Button>
                    <Button variant="outline-primary" onClick={() => setShowAddExpenseModal(true)}>Add Expense</Button>
                </Stack>
                <div className="budgetCards">
                    {allBudgets.map((value, key) => (
                        <BudgetCard
                            key={value.Id} 
                            name={value.BudgetName}      
                            amount={value.BudgetAmount}  
                            max={value.Max}
                            //onAddExpenseClick={() => openAddExpenseModal(value.Id)}
                            onViewExpensesClick={() => {
                                console.log("Value id in App.js " + value.Id)
                                getBudgetExpenses(value.Id)
                                setViewExpensesModal(true)
                            }}            
                        >
                        </BudgetCard>
                    ))}                   
                </div>
            </Container>
            <AddBudgetModal
                show={showAddBudgetModal}
                handleClose={() => setShowAddBudgetModal(false)}
            />
             {/* <AddExpenseModal
                show={showAddExpenseModal}
                defaultBudgetId={addExpenseModalBudgetId}
                handleClose={() => setShowAddExpenseModal(false)}
            /> */}
            <ViewExpensesModal
                show={viewExpensesModal}
                handleClose={() => setViewExpensesModal(false)}
            />
      </>           
   )
}

export default App;
