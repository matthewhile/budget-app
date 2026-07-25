import '../styles/Dashboard.css';
import { useState } from 'react';
import { Container, Stack, Button, Alert, Form } from 'react-bootstrap';
import {useAuth} from "../contexts/AuthContext"
import BudgetCard from '../components/BudgetCard';
import UncategorizedBudgetCard from "../components/UncategorizedBudgetCard";
import ViewExpensesModal from "../components/ViewExpensesModal";
import AddBudgetModal from "../components/AddBudgetModal";
import ConfirmDeleteBudgetModal from '../components/ConfirmDeleteModal';
import AddExpenseModal from "../components/AddExpenseModal";
import EditBudgetModal from "../components/EditBudgetModal"
import TotalBudgetCard from "../components/TotalBudgetCard"
import { useBudgets } from '../contexts/BudgetContext';

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const now = new Date();
const CURRENT_YEAR = now.getFullYear();
const CURRENT_MONTH = now.getMonth() + 1;
const YEARS = [CURRENT_YEAR, CURRENT_YEAR + 1];

function Dashboard() {

  const { budgets, uncategorizedBudget, loadBudgetsError, setLoadBudgetsError, deleteBudget, loadBudgets } = useBudgets();
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false)
  const [showEditBudgetModal, setShowEditBudgetModal] = useState(false)
  const [showConfirmDelteBudgetModal, setShowConfirmDelteBudgetModal] = useState(false)

  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false)
  const [viewExpensesModal, setViewExpensesModal] = useState();

  const [selectedBudgetId, setSelectedBudgetId] = useState()

  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [selectedMonth, setSelectedMonth] = useState(CURRENT_MONTH);

  const {logout} = useAuth()

  const currentMonthName = MONTHS[selectedMonth - 1]

  function openAddExpenseModal(budgetId) {
      setShowAddExpenseModal(true)
      setSelectedBudgetId(budgetId)
  }

  function openConfirmDeleteBudgetModal(budgetId) {
      setShowConfirmDelteBudgetModal(true)
      setSelectedBudgetId(budgetId)
  }

  function openEditBudgetModal(budgetId) {
      setShowEditBudgetModal(true)
      setSelectedBudgetId(budgetId)
  }

  function handleYearChange(e) {
      const newYear = parseInt(e.target.value);
      const newMonth = newYear === CURRENT_YEAR ? CURRENT_MONTH : 1;
      setSelectedYear(newYear);
      setSelectedMonth(newMonth);
      loadBudgets(newMonth, newYear);
  }

  function handleMonthChange(e) {
      const newMonth = parseInt(e.target.value);
      setSelectedMonth(newMonth);
      loadBudgets(newMonth, selectedYear);
  }

  return (
      <>
        <div className="dashboard-container">
            <Container className="my-4">
            <div className="logout-btn">
                <Button varient="primary" onClick={() => logout()}>Log out</Button>
            </div>
              <Stack direction="horizontal" gap="2" className="mb-4">
                  <h1 className="me-auto">{currentMonthName} Budgets</h1>
                  <Button variant="primary" onClick={() => setShowAddBudgetModal(true)}>Add Budget</Button>
                  <Button variant="outline-primary" onClick={() => setShowAddExpenseModal(true)}>Add Expense</Button>
              </Stack>
              <Stack direction="horizontal" gap="2" className="mb-4">
                  <Form.Select
                      style={{ width: "auto" }}
                      value={selectedYear}
                      onChange={handleYearChange}
                  >
                      {YEARS.map(y => (
                          <option key={y} value={y}>{y}</option>
                      ))}
                  </Form.Select>
                  <Form.Select
                      style={{ width: "auto" }}
                      value={selectedMonth}
                      onChange={handleMonthChange}
                  >
                      {MONTHS.map((name, i) => (
                          <option key={i + 1} value={i + 1}>{name}</option>
                      ))}
                  </Form.Select>
              </Stack>
               {loadBudgetsError && (<Alert variant="danger" dismissible onClose={() => setLoadBudgetsError(null)}>{loadBudgetsError}</Alert>)}
              <div className="budgetCards">
                  {budgets.map(budget =>
                     budget.id !== uncategorizedBudget?.id ?  (
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
                          onDeleteBudgetClick={() => {
                                openConfirmDeleteBudgetModal(budget.id)
                                setShowConfirmDelteBudgetModal(true)
                          }}
                      >
                      </BudgetCard>
                    ) : null
                  )}
                  <UncategorizedBudgetCard
                    onAddExpenseClick={() => {
                        openAddExpenseModal(uncategorizedBudget?.id)
                        setShowAddExpenseModal(true)
                    }}
                    onViewExpensesClick={() =>
                        setViewExpensesModal(uncategorizedBudget?.id)
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
          <ConfirmDeleteBudgetModal
                show={showConfirmDelteBudgetModal}
                budgetId={selectedBudgetId}
                handleClose={() => setShowConfirmDelteBudgetModal(false)}
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
