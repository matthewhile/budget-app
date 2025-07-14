import './App.css'
import { useState } from 'react';
import { Container, Stack, Button } from 'react-bootstrap';
import BudgetCard from './components/BudgetCard';
import ViewExpensesModal from "./components/ViewExpensesModal";
import AddBudgetModal from "./components/AddBudgetModal";
import AddExpenseModal from "./components/AddExpenseModal";
import EditBudgetModal from "./components/EditBudgetModal"
import { useBudgets } from './contexts/BudgetContext';


function App() {

  const { allBudgets } = useBudgets();
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false)
  const [editBudgetModal, setEditBudgetModal] = useState(false)
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false)
  const [viewExpensesModal, setViewExpensesModal] = useState();
  const [addExpenseModalBudgetId, setAddExpenseModalBudgetId] = useState() 

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
                  {allBudgets.map(budget => (
                      <BudgetCard
                          key={budget.id} 
                          name={budget.name}      
                          amount={budget.totalSpent}
                          max={budget.maxAmount}     
                          onAddExpenseClick={() => {
                                console.log("budget id in App.js " + budget.id)
                                openAddExpenseModal(budget.id)
                                setShowAddExpenseModal(true)
                          }}
                          onViewExpensesClick={() => {
                                console.log("budget id in App.js " + budget.id)
                                setViewExpensesModal(budget.id)
                          }}
                          onEditBudgetClick={() => {
                                console.log("budget id in App.js " + budget.id)
                                setEditBudgetModal(budget.id)
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
          <EditBudgetModal
                show={editBudgetModal}
                handleClose={() => setEditBudgetModal()}
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

export default App
