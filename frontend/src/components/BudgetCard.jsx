import { Button, Card, Dropdown, ProgressBar, Stack } from "react-bootstrap";
import { currencyFormatter } from "../utils"
import { FaEllipsisVertical } from "react-icons/fa6";
import React from "react";

const EditToggle = React.forwardRef(({ onClick }, ref) => (
  <button className="editBudgetBtn" ref={ref} onClick={e => { e.preventDefault(); onClick(e); }}>
    <FaEllipsisVertical size={20} />
  </button>
));

export default function BudgetCard({
    name,
    amount,
    max,
    gray,
    hideButtons,
    onAddExpenseClick,
    onViewExpensesClick,
    onEditBudgetClick,
    onDeleteBudgetClick
  }) {
    const classNames = []
    if (amount > max) {
        classNames.push("bg-danger", "bg-opacity-10")
    } else if (gray) {
        classNames.push("bg-light")
    }

  return (
    <Card className={classNames.join(" ")}>
      {name.toLowerCase() !== "uncategorized" && name.toLowerCase() !== "total" && (
        <Dropdown>
          <Dropdown.Toggle as={EditToggle} />
          <Dropdown.Menu>
            <Dropdown.Item onClick={onEditBudgetClick}>Edit</Dropdown.Item>
            <Dropdown.Item onClick={onDeleteBudgetClick} className="text-danger">Delete</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
        <Card.Body>
            <Card.Title className="d-flex justify-content-between align-items-baseline fw-normal mb-3">
               <div className="me-2">{name}</div> 
               <div className="d-flex align-items-baseline">
                  {currencyFormatter.format(amount)}
                    {max && (
                      <span className="text-muted fs-6 ms-1"> 
                          / {currencyFormatter.format(max)}
                      </span>
                    )}
                </div>
            </Card.Title>
            {max && (
              <ProgressBar 
                className="rounded-pill" 
                variant={getProgressBarColor(amount, max)}
                min={0}
                max={max}
                now={amount}
              />
            )}        
            {!hideButtons && (
                <Stack direction="horizontal" gap="5" className="mt-4">
                  <Button
                      variant={getAddBtnColor(amount, max)}
                      className="ms-auto text-nowrap" 
                      onClick={onAddExpenseClick}
                  >
                      Add Expense
                  </Button>
                  <Button 
                      variant="outline-secondary" 
                      className="ms-auto text-nowrap"
                      onClick={onViewExpensesClick}                      
                  >
                      View Expenses
                  </Button>
                </Stack>
        )}
        </Card.Body>
    </Card>
  )
}

function getProgressBarColor(amount, max) {
    const ratio = amount / max
    if (ratio < 0.5) return "success"
    if (ratio < 0.75) return "warning"
    return "danger"
}

function getAddBtnColor(amount, max) {
  const ratio = amount / max
  if (max == null) return "outline-primary"
  if (ratio < 0.5) return "outline-success"
  if (ratio < 0.75) return "outline-warning"
  return "outline-danger"
}

