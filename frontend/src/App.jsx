import './App.css'
import { Container, Stack, Button } from 'react-bootstrap';
import BudgetCard from './components/BudgetCard';
import { useBudgets } from './contexts/BudgetContext';


function App() {

  const { allBudgets } = useBudgets();
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
                      >
                      </BudgetCard>
                  ))}                 
              </div>
          </Container>
    </>           
  )
}

export default App
