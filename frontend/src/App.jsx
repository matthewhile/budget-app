import './index.css'
import { useState } from 'react';
import { Container, Stack, Button } from 'react-bootstrap';
import BudgetCard from './components/BudgetCard';
import UncategorizedBudgetCard from "./components/UncategorizedBudgetCard";
import ViewExpensesModal from "./components/ViewExpensesModal";
import AddBudgetModal from "./components/AddBudgetModal";
import AddExpenseModal from "./components/AddExpenseModal";
import EditBudgetModal from "./components/EditBudgetModal"
import { UNCATEGORIZED_BUDGET_ID, useBudgets } from './contexts/BudgetContext';


function App() {

  const { allBudgets } = useBudgets();
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false)
  const [showEditBudgetModal, setShowEditBudgetModal] = useState(false);

  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false)
  const [viewExpensesModal, setViewExpensesModal] = useState();

  const [selectedBudgetId, setSelectedBudgetId] = useState() 

  function openAddExpenseModal(budgetId) {
      setShowAddExpenseModal(true)
      setSelectedBudgetId(budgetId)
  }

  function openEditBudgetModal(budgetId) {
      setShowEditBudgetModal(true)
      setSelectedBudgetId(budgetId)
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
                  {allBudgets.map(budget => 
                     budget.id !== UNCATEGORIZED_BUDGET_ID ? (
                         <BudgetCard
                          key={budget.id} 
                          name={budget.name}      
                          amount={budget.totalSpent}
                          max={budget.maxAmount}     
                          onAddExpenseClick={() => {
                                openAddExpenseModal(budget.id)
                                setShowAddExpenseModal(true)
                          }}
                          onViewExpensesClick={() => {
                                setViewExpensesModal(budget.id)
                          }}
                          onEditBudgetClick={() => {
                                openEditBudgetModal(budget.id)
                                setShowEditBudgetModal(true)
                          }}      
                      >
                      </BudgetCard>
                    ) : null   
                  )}
                  <UncategorizedBudgetCard
                    onAddExpenseClick={() => {
                        openAddExpenseModal(UNCATEGORIZED_BUDGET_ID)
                        setShowAddExpenseModal(true)
                    }}
                    onViewExpensesClick={() =>
                        setViewExpensesModal(UNCATEGORIZED_BUDGET_ID)
                    }
                 />                 
              </div>
          </Container>
          <AddBudgetModal
                show={showAddBudgetModal}
                handleClose={() => setShowAddBudgetModal(false)}
          />
          <EditBudgetModal
                show={showEditBudgetModal}
                budgetId={selectedBudgetId}
                handleClose={() => setShowEditBudgetModal(false)}
          />
          <AddExpenseModal
                show={showAddExpenseModal}
                defaultBudgetId={selectedBudgetId}
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
