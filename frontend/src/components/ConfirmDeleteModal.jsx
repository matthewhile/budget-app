import { Modal, Button, Alert, OverlayTrigger, Tooltip } from "react-bootstrap"
import { useState } from "react"
import { FaCircleQuestion } from "react-icons/fa6"
import { useBudgets } from "../contexts/BudgetContext"

export default function ConfirmDeleteBudgetModal({ show, budgetId, handleClose }) {

    const { allBudgets, deleteBudget } = useBudgets();
    const [deleteError, setDeleteError] = useState(null);

    const budget = allBudgets.find(b => b.id === budgetId);

    const handleDeleteBudget = async () => {
    setDeleteError(null)
    try {
        await deleteBudget(budgetId);
        handleClose();
    } catch (error) {
        console.error("Failed to delete buget", error)
        setDeleteError("Something wen't wrong! Failed to delete budget.");
    }
    }

    return (
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title className="text-danger">Delete Budget - {budget?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="mb-4">
                Are you sure you want to delete this budget{" "}
                <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip>Expenses in this budget will be moved to Uncategorized.</Tooltip>}
                >
                    <span style={{ cursor: "pointer" }}>
                        <FaCircleQuestion />
                    </span>
                </OverlayTrigger>
            </div>
            <div className="d-flex justify-content-end">
                <Button onClick={handleDeleteBudget} variant="outline-danger">Delete Budget</Button>
            </div>
            {deleteError && (<Alert variant="danger">{deleteError}</Alert>)}
        </Modal.Body>
    </Modal>
    )
}
