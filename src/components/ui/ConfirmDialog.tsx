import { AlertTriangle } from "lucide-react"
import { Button } from "./button"
import { Modal } from "./Modal"

interface ConfirmDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title?: string
    message?: string
    confirmText?: string
    cancelText?: string
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Delete",
    message = "Are you sure you want to delete this item? This action cannot be undone.",
    confirmText = "Delete",
    cancelText = "Cancel"
}: ConfirmDialogProps) {
    const handleConfirm = () => {
        onConfirm()
        onClose()
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            footer={
                <div className="flex gap-3 justify-end">
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                    >
                        {confirmText}
                    </Button>
                </div>
            }
        >
            <div className="flex flex-col items-center text-center py-4">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-muted-foreground">{message}</p>
            </div>
        </Modal>
    )
}
