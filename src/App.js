import './App.css';
import { useState } from 'react';
import { Button, Stack } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import BudgetCard from "./components/BudgetCard";
import AddBudgetModal from "./components/AddBudgetModal";
import ViewExpensesModal from "./components/ViewExpensesModal"
import AddExpenseModal from "./components/AddExpenseModal";
import { useBudgets } from "./contexts/BudgetsContext";

function App() {

    const [showAddBudgetModal, setShowAddBudgetModal] = useState(false)
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false)
    const [viewExpensesModal, setViewExpensesModal] = useState()
    const [addExpenseModalBudgetId, setAddExpenseModalBudgetId] = useState() 
    const { allBudgets, getBudgetExpenses } = useBudgets();


    function openAddExpenseModal(budgetId) {
        setShowAddExpenseModal(true)
        setAddExpenseModalBudgetId(budgetId)
    }

    return (
        <>
            <Container className="my-4">
                <Stack direction="horizontal" gap="2" className="mb-4">
                        <h1 className="me-auto">Budgets</h1>
                    <Button variant="primary" onClick={() => setShowAddBudgetModal(true)}>Add Budget</Button>
                    <Button variant="outline-primary" onClick={() => setShowAddExpenseModal(true)}>Add Expense</Button>
                </Stack>
                <div className="budgetCards">
                    {allBudgets.map(budget => {
                        const amount = getBudgetExpenses(budget.Id).reduce(
                            (total, expense) => total + expense.ExpenseAmount,
                            0
                          )
                          return (
                        <BudgetCard
                            key={budget.Id} 
                            name={budget.BudgetName}      
                            amount={amount}  
                            max={budget.Max}
                            onAddExpenseClick={() => {
                                console.log("budget id in App.js " + budget.Id)
                                openAddExpenseModal(budget.Id)
                                setShowAddExpenseModal(true)
                            }}
                            onViewExpensesClick={() => {
                                console.log("budget id in App.js " + budget.Id)
                                setViewExpensesModal(budget.Id)
                            }}            
                        >
                        </BudgetCard>
                        )
                    })}                   
                </div>
            </Container>
            <AddBudgetModal
                show={showAddBudgetModal}
                handleClose={() => setShowAddBudgetModal(false)}
            />
             <AddExpenseModal
                show={showAddExpenseModal}
                defaultBudgetId={addExpenseModalBudgetId}
                handleClose={() => setShowAddExpenseModal(false)}
            />
            <ViewExpensesModal
                budgetId={viewExpensesModal}
                handleClose={() => setViewExpensesModal()}
            />
      </>           
   )
}

export default App;
