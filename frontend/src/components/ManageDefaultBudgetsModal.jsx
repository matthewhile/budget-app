import { Form, Modal, Button, Alert } from "react-bootstrap"
import { useEffect, useState } from "react"
import { useBudgets } from "../contexts/BudgetContext"
import { currencyFormatter } from "../utils"

export default function ManageDefaultBudgetsModal({ show, handleClose }) {
  const { defaultBudgets, loadDefaultBudgets, syncDefaultBudgets } = useBudgets();
  const [checkedNames, setCheckedNames] = useState(new Set());
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (show) {
      setSubmitError(null);
      loadDefaultBudgets();
    }
  }, [show]);

  useEffect(() => {
    setCheckedNames(new Set(defaultBudgets.filter(b => b.isSelected).map(b => b.name)));
  }, [defaultBudgets]);

  function toggleName(name) {
    setCheckedNames(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    const selected = defaultBudgets
      .filter(b => checkedNames.has(b.name))
      .map(b => ({ name: b.name, maxAmount: b.maxAmount }));
    try {
      await syncDefaultBudgets(selected);
      handleClose();
    } catch (error) {
      console.log(error)
      setSubmitError("Failed to save default budgets. Please try again.")
    }
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={handleSave}>
        <Modal.Header closeButton>
          <Modal.Title>Manage Default Budgets</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {defaultBudgets.length === 0 ? (
            <p className="text-muted mb-0">
              You don't have any budgets yet. Create a budget first, then come back here to mark it as a default.
            </p>
          ) : (
            defaultBudgets.map(b => (
              <Form.Check
                key={b.name}
                type="checkbox"
                id={`default-budget-${b.name}`}
                label={`${b.name} (${currencyFormatter.format(b.maxAmount)})`}
                checked={checkedNames.has(b.name)}
                onChange={() => toggleName(b.name)}
              />
            ))
          )}
          {submitError && (<Alert variant="danger" className="mt-3">{submitError}</Alert>)}
          <div className="d-flex justify-content-end mt-3">
            <Button variant="primary" type="submit" disabled={defaultBudgets.length === 0}>Save</Button>
          </div>
        </Modal.Body>
      </Form>
    </Modal>
  )
}
