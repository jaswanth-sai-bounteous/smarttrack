import { Plus, X } from "lucide-react"
import { Button } from "../ui/button"

interface FloatingActionButtonProps {
  onOpen: () => void
  isOpen: boolean
  onClose: () => void
}

export default function FloatingActionButton({
  onOpen,
  isOpen,
  onClose,
}: FloatingActionButtonProps) {
  return (
    <div className="fixed bottom-8 right-8 z-40">
      {isOpen ? (
        <Button
          onClick={onClose}
          size="icon-lg"
          className="rounded-full bg-gradient-to-r from-destructive to-destructive/80 hover:shadow-lg shadow-destructive/30"
        >
          <X className="w-6 h-6" />
        </Button>
      ) : (
        <Button
          onClick={onOpen}
          size="icon-lg"
          className="rounded-full bg-gradient-to-r from-primary to-primary/80 hover:shadow-xl shadow-lg shadow-primary/40 animate-bounce"
        >
          <Plus className="w-6 h-6" />
        </Button>
      )}
    </div>
  )
}
