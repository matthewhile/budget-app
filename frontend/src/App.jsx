import './App.css'
import { useState } from 'react';
import { Container, Stack, Button } from 'react-bootstrap';
import BudgetCard from './components/BudgetCard';
import ViewExpensesModal from "./components/ViewExpensesModal";
import { useBudgets } from './contexts/BudgetContext';



function App() {

  const { allBudgets } = useBudgets();
  const [viewExpensesModal, setViewExpensesModal] = useState();
  return (
      <>
          <Container className="my-4">
              <Stack direction="horizontal" gap="2" className="mb-4">
                      <h1 className="me-auto">Budgets</h1>
                  <Button variant="primary">Add Budget</Button>
                  <Button variant="outline-primary">Add Expense</Button>
              </Stack>
              <div className="budgetCards">
                  {allBudgets.map(budget => (
                      <BudgetCard
                          key={budget.id} 
                          name={budget.name}      
                          amount={budget.totalSpent}
                          max={budget.maxAmount}     

                          onViewExpensesClick={() => {
                                console.log("budget id in App.js " + budget.id)
                                setViewExpensesModal(budget.id)
                          }}      
                      >
                      </BudgetCard>
                  ))}                 
              </div>
          </Container>
          <ViewExpensesModal
                budgetId={viewExpensesModal}
                handleClose={() => setViewExpensesModal()}
            />
    </>           
  )
}

export default App
