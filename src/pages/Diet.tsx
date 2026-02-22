import { useState } from "react"
import { useTracker } from "../context/TrackerContext"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import FloatingActionButton from "../components/layout/FloatingActionButton"
import Modal from "../components/layout/Modal"
import { Apple, Calendar, Trash2, Pencil } from "lucide-react"

export default function Diet() {
  const {
    state,
    addDietDay,
    addDietEntry,
    deleteDietDay,
    deleteDietEntry,
    editDietEntry,
  } = useTracker()

  const [newDate, setNewDate] = useState("")
  const [food, setFood] = useState("")
  const [protein, setProtein] = useState<number>(0)
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null)
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false)

  /* ---------------- ADD DAY ---------------- */

  const handleAddDay = () => {
    if (!newDate) return
    addDietDay(newDate)
    setNewDate("")
    setIsModalOpen(false)
  }

  /* ---------------- ADD / EDIT ENTRY ---------------- */

  const handleSaveEntry = () => {
    if (!selectedDayId || !food || protein <= 0) return

    if (editingEntryId) {
      editDietEntry(selectedDayId, editingEntryId, { food, protein })
    } else {
      addDietEntry(selectedDayId, food, protein)
    }

    resetEntryModal()
  }

  const resetEntryModal = () => {
    setFood("")
    setProtein(0)
    setEditingEntryId(null)
    setSelectedDayId(null)
    setIsEntryModalOpen(false)
  }

  const getDayWithDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00")
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const day = days[date.getDay()]
    return `${day}, ${dateStr}`
  }

  return (
    <div className="p-6 space-y-8 min-h-screen bg-gradient-to-br from-background via-background to-green-500/5">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
          <Apple className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">Diet Tracker</h2>
          <p className="text-muted-foreground text-sm">
            Track your nutrition intake
          </p>
        </div>
      </div>

      {/* Diet Days */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Nutrition Log
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.dietDays.length > 0 ? (
            state.dietDays.map(day => {
              const totalProtein = day.entries.reduce(
                (sum, e) => sum + e.protein,
                0
              )

              return (
                <Card
                  key={day.id}
                  className="p-5 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <p className="text-xs font-semibold text-green-600/70 uppercase tracking-wider">
                        {getDayWithDate(day.date)}
                      </p>

                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          Total Protein
                        </p>
                        <p className="text-lg font-bold text-green-600">
                          {totalProtein}g
                        </p>
                      </div>
                    </div>

                    {/* Entries */}
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {day.entries.length > 0 ? (
                        day.entries.map(entry => (
                          <div
                            key={entry.id}
                            className="p-2 bg-green-50/50 dark:bg-green-950/20 rounded-lg border border-green-200/50 dark:border-green-900/30 flex justify-between items-center"
                          >
                            <div>
                              <p className="text-sm font-medium">
                                {entry.food}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {entry.protein}g protein
                              </p>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedDayId(day.id)
                                  setEditingEntryId(entry.id)
                                  setFood(entry.food)
                                  setProtein(entry.protein)
                                  setIsEntryModalOpen(true)
                                }}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>

                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() =>
                                  deleteDietEntry(day.id, entry.id)
                                }
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground text-center py-4">
                          No entries yet
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedDayId(day.id)
                          setIsEntryModalOpen(true)
                        }}
                        className="w-full"
                      >
                        + Add Entry
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteDietDay(day.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">
                No diet days yet. Create one with the + button!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal for creating new day */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setNewDate("")
        }}
        title="New Diet Day"
      >
        <div className="space-y-4">
          <Input
            type="date"
            value={newDate}
            onChange={e => setNewDate(e.target.value)}
          />

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handleAddDay} className="flex-1">
              Create Day
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal for adding/editing entry */}
      <Modal
        isOpen={isEntryModalOpen}
        onClose={resetEntryModal}
        title={editingEntryId ? "Edit Food Entry" : "Add Food Entry"}
      >
        <div className="space-y-4">
          <Input
            placeholder="Food Name"
            value={food}
            onChange={e => setFood(e.target.value)}
          />

          <Input
            type="number"
            placeholder="Protein (g)"
            value={protein || ""}
            onChange={e => setProtein(Number(e.target.value) || 0)}
          />

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={resetEntryModal}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEntry} className="flex-1">
              {editingEntryId ? "Update" : "Save"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Floating Action Button */}
      <FloatingActionButton
        isOpen={isModalOpen || isEntryModalOpen}
        onOpen={() => setIsModalOpen(true)}
        onClose={() => {
          setIsModalOpen(false)
          resetEntryModal()
        }}
      />
    </div>
  )
}