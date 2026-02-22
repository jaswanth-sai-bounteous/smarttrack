import { useState } from "react"
import { useTracker } from "../context/TrackerContext"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import FloatingActionButton from "../components/layout/FloatingActionButton"
import Modal from "../components/layout/Modal"
import { BookOpen, Calendar, Trash2, Pencil } from "lucide-react"

export default function Study() {
  const { state, addStudyDay, deleteStudyDay, editStudyDay } = useTracker()

  const [date, setDate] = useState("")
  const [topic, setTopic] = useState("")
  const [hours, setHours] = useState<number>(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDayId, setEditingDayId] = useState<string | null>(null)

  /* ---------------- CREATE / EDIT ---------------- */
  const handleSaveSession = () => {
    if (!date || !topic || hours <= 0) return

    const data = { date, topic, hours }

    if (editingDayId) {
      editStudyDay(editingDayId, data)
    } else {
      addStudyDay(data)
    }

    resetModal()
  }

  const resetModal = () => {
    setDate("")
    setTopic("")
    setHours(0)
    setEditingDayId(null)
    setIsModalOpen(false)
  }

  const getDayWithDate = (dateStr: string) => {
    const dateObj = new Date(dateStr + "T00:00:00")
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const day = days[dateObj.getDay()]
    return `${day}, ${dateStr}`
  }

  return (
    <div className="p-6 space-y-8 min-h-screen bg-gradient-to-br from-background via-background to-purple-500/5">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">Study Tracker</h2>
          <p className="text-muted-foreground text-sm">Track your learning sessions</p>
        </div>
      </div>

      {/* Study Sessions */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Study Sessions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.studyDays.length > 0 ? (
            state.studyDays.map(day => (
              <Card
                key={day.id}
                className="p-5 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-semibold text-purple-600/70 uppercase tracking-wider">
                      {getDayWithDate(day.date)}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setEditingDayId(day.id)
                          setDate(day.date)
                          setTopic(day.topic)
                          setHours(day.hours)
                          setIsModalOpen(true)
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteStudyDay(day.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50/50 dark:bg-purple-950/20 rounded-lg border border-purple-200/50 dark:border-purple-900/30">
                    <p className="text-sm font-medium text-foreground">{day.topic}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Hours Studied: {day.hours}h
                    </p>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">
                No study sessions yet. Create one with the + button!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal for adding/editing study session */}
      <Modal
        isOpen={isModalOpen}
        onClose={resetModal}
        title={editingDayId ? "Edit Study Session" : "New Study Session"}
      >
        <div className="space-y-4">
          <Input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
          <Input
            placeholder="What are you studying?"
            value={topic}
            onChange={e => setTopic(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Hours studied"
            value={hours || ""}
            onChange={e => setHours(Number(e.target.value) || 0)}
          />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={resetModal} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSaveSession} className="flex-1">
              {editingDayId ? "Update Session" : "Create Session"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Floating Action Button */}
      <FloatingActionButton
        isOpen={isModalOpen}
        onOpen={() => setIsModalOpen(true)}
        onClose={resetModal}
      />
    </div>
  )
}