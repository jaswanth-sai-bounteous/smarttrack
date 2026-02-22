import { useState } from "react"
import { useTracker } from "../context/TrackerContext"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import FloatingActionButton from "../components/layout/FloatingActionButton"
import Modal from "../components/layout/Modal"
import { Calendar, Zap, Trash2, Pencil } from "lucide-react"

const muscles = ["Chest", "Back", "Triceps", "Legs", "Shoulders", "Biceps", "Abs"]

export default function Gym() {
  const { state, addGymDay, deleteGymDay, editGymDay } = useTracker()

  const [date, setDate] = useState("")
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([])
  const [cardioMinutes, setCardioMinutes] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDayId, setEditingDayId] = useState<string | null>(null)

  /* ---------------- CREATE / EDIT ---------------- */
  const handleSaveSession = () => {
    if (!date || (selectedMuscles.length === 0 && cardioMinutes === 0)) return

    const data = {
      date,
      muscleGroups: selectedMuscles as any,
      cardioMinutes,
    }

    if (editingDayId) {
      editGymDay(editingDayId, data)
    } else {
      addGymDay(data)
    }

    resetModal()
  }

  const resetModal = () => {
    setDate("")
    setSelectedMuscles([])
    setCardioMinutes(0)
    setEditingDayId(null)
    setIsModalOpen(false)
  }

  const getDayWithDate = (dateStr: string) => {
    const dateObj = new Date(dateStr)
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const day = days[dateObj.getDay()]
    return `${day}, ${dateStr}`
  }

  return (
    <div className="p-6 space-y-8 min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-primary to-primary/60 rounded-lg">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">Gym Tracker</h2>
          <p className="text-muted-foreground text-sm">Track your workouts and cardio</p>
        </div>
      </div>

      {/* Recent Sessions */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Recent Sessions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.gymDays.length > 0 ? (
            state.gymDays.map(day => (
              <Card
                key={day.id}
                className="p-5 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-semibold text-primary/70 uppercase tracking-wider">
                      {getDayWithDate(day.date)}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setEditingDayId(day.id)
                          setDate(day.date)
                          setSelectedMuscles(day.muscleGroups as string[])
                          setCardioMinutes(day.cardioMinutes)
                          setIsModalOpen(true)
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteGymDay(day.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {day.muscleGroups.map(muscle => (
                      <span
                        key={muscle}
                        className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20"
                      >
                        {muscle}
                      </span>
                    ))}
                  </div>

                  {day.cardioMinutes > 0 && (
                    <div className="pt-2 border-t border-border/50 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{day.cardioMinutes}</span> min cardio
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No workout sessions yet. Create one with the + button!</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={resetModal}
        title={editingDayId ? "Edit Workout Session" : "New Workout Session"}
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold mb-2 block">Select Date</label>
            <Input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">Select Muscle Groups</label>
            <div className="grid grid-cols-2 gap-2">
              {muscles.map(m => (
                <Button
                  key={m}
                  variant={selectedMuscles.includes(m) ? "default" : "outline"}
                  onClick={() =>
                    setSelectedMuscles(prev =>
                      prev.includes(m)
                        ? prev.filter(x => x !== m)
                        : [...prev, m]
                    )
                  }
                  className="w-full"
                >
                  {m}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">Cardio Minutes</label>
            <Input
              type="number"
              placeholder="Enter cardio duration"
              value={cardioMinutes || ""}
              onChange={e => setCardioMinutes(Number(e.target.value) || 0)}
              className="w-full"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={resetModal} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSaveSession} className="flex-1">
              {editingDayId ? "Update Session" : "Save Session"}
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