import '../styles/Dashboard.css';
import { useState, useEffect } from 'react';
import { Container, Stack, Button } from 'react-bootstrap';
import {useAuth} from "../contexts/AuthContext"
import BudgetCard from '../components/BudgetCard';
import UncategorizedBudgetCard from "../components/UncategorizedBudgetCard";
import ViewExpensesModal from "../components/ViewExpensesModal";
import AddBudgetModal from "../components/AddBudgetModal";
import AddExpenseModal from "../components/AddExpenseModal";
import EditBudgetModal from "../components/EditBudgetModal"
import TotalBudgetCard from "../components/TotalBudgetCard"
import { UNCATEGORIZED_BUDGET_ID, useBudgets } from '../contexts/BudgetContext';


function Dashboard() {

  const { allBudgets, getAllBudgets } = useBudgets();
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false)
  const [showEditBudgetModal, setShowEditBudgetModal] = useState(false);

  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false)
  const [viewExpensesModal, setViewExpensesModal] = useState();

  const [selectedBudgetId, setSelectedBudgetId] = useState() 

  const {logout} = useAuth()

  function openAddExpenseModal(budgetId) {
      setShowAddExpenseModal(true)
      setSelectedBudgetId(budgetId)
  }

  function openEditBudgetModal(budgetId) {
      setShowEditBudgetModal(true)
      setSelectedBudgetId(budgetId)
  }

  useEffect(() => {
        getAllBudgets();
  }, []);


  return (
      <>
        <div className="dashboard-container">
            <Container className="my-4">
            <div className="logout-btn">
                <Button varient="primary" onClick={() => logout()}>Log out</Button>
            </div>
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
                 <TotalBudgetCard/>                
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

        </div>
    </>           
  )
}

export default Dashboard