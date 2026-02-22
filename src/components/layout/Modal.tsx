import type { ReactNode } from "react"
import { X } from "lucide-react"
import { Button } from "../ui/button"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon-sm"
            className="rounded-lg"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4">{children}</div>
      </div>
    </div>
  )
}
