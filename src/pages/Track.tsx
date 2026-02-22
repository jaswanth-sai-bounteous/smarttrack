import { useTracker } from "../context/TrackerContext"
import { Card } from "../components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { Activity, Apple, BookOpen } from "lucide-react"

export default function Track() {
  const { state } = useTracker()

  /* ---------------- GET UNIQUE DATES ---------------- */
  const allDates = new Set<string>()
  state.gymDays.forEach(day => allDates.add(day.date))
  state.dietDays.forEach(day => allDates.add(day.date))
  state.studyDays.forEach(day => allDates.add(day.date))

  const sortedDates = Array.from(allDates).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  )

  /* ---------------- DAY-WISE DATA ---------------- */
  const dayWiseData = sortedDates.map(date => {
    const gymDay = state.gymDays.find(d => d.date === date)
    const dietDay = state.dietDays.find(d => d.date === date)
    const studyDay = state.studyDays.find(d => d.date === date)

    return {
      date,
      dayName: getDayName(date),
      gym: gymDay ? (gymDay.muscleGroups.length + (gymDay.cardioMinutes > 0 ? 1 : 0)) : 0,
      diet: dietDay ? dietDay.entries.length : 0,
      study: studyDay ? studyDay.hours : 0,
      gymCardio: gymDay ? gymDay.cardioMinutes : 0,
      dietProtein: dietDay ? dietDay.entries.reduce((sum, e) => sum + e.protein, 0) : 0,
      studyHours: studyDay ? studyDay.hours : 0,
    }
  })

  function getDayName(dateStr: string) {
    const date = new Date(dateStr + "T00:00:00")
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    return days[date.getDay()]
  }

  function formatDateShort(dateStr: string) {
    const date = new Date(dateStr + "T00:00:00")
    return `${getDayName(dateStr)} ${date.getDate()}`
  }

  /* ---------------- GYM METRICS ---------------- */
  const muscleFrequency: Record<string, number> = {}
  state.gymDays.forEach(day => {
    day.muscleGroups.forEach(m => {
      muscleFrequency[m] = (muscleFrequency[m] || 0) + 1
    })
  })
  const muscleData = Object.entries(muscleFrequency)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
  const totalCardio = state.gymDays.reduce((sum, d) => sum + d.cardioMinutes, 0)
  const totalGymDays = state.gymDays.length

  /* ---------------- DIET METRICS ---------------- */
  const avgProtein =
    state.dietDays.length > 0
      ? (
          state.dietDays.reduce(
            (sum, d) => sum + d.entries.reduce((s, e) => s + e.protein, 0),
            0
          ) / state.dietDays.length
        ).toFixed(1)
      : 0
  const totalEntries = state.dietDays.reduce((sum, d) => sum + d.entries.length, 0)

  /* ---------------- STUDY METRICS ---------------- */
  const totalStudyDays = state.studyDays.length
  const totalStudyHours = state.studyDays.reduce((sum, d) => sum + d.hours, 0)
  const topics = new Set(state.studyDays.map(d => d.topic))

  return (
    <div className="p-6 space-y-8 min-h-screen bg-gradient-to-br from-background via-background to-blue-50/5">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">Performance Dashboard</h2>
        <p className="text-muted-foreground mt-1">Track your progress across all areas</p>
      </div>

      {/* Day-wise Overview Chart */}
      {dayWiseData.length > 0 && (
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Day-wise Activity Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={dayWiseData.map(d => ({ ...d, displayDate: formatDateShort(d.date) }))}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis dataKey="displayDate" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="gym" fill="#6366f1" name="Gym Sessions" />
              <Bar dataKey="diet" fill="#22c55e" name="Diet Entries" />
              <Bar dataKey="study" fill="#a855f7" name="Study Hours" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Insights Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gym */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold">Gym Insights</h3>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-indigo-50/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Total Sessions</p>
              <p className="text-2xl font-bold text-indigo-600">{totalGymDays}</p>
            </div>
            <div className="p-3 bg-indigo-50/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Total Cardio</p>
              <p className="text-2xl font-bold text-indigo-600">{totalCardio} min</p>
            </div>
          </div>

          {muscleData.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-2">Muscle Groups</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={muscleData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Diet */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
              <Apple className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold">Diet Insights</h3>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-green-50/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Total Days</p>
              <p className="text-2xl font-bold text-green-600">{state.dietDays.length}</p>
            </div>
            <div className="p-3 bg-green-50/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Avg Protein/Day</p>
              <p className="text-2xl font-bold text-green-600">{avgProtein}g</p>
            </div>
            <div className="p-3 bg-green-50/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Total Entries</p>
              <p className="text-2xl font-bold text-green-600">{totalEntries}</p>
            </div>
          </div>
        </Card>

        {/* Study */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold">Study Insights</h3>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-purple-50/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Total Sessions</p>
              <p className="text-2xl font-bold text-purple-600">{totalStudyDays}</p>
            </div>
            <div className="p-3 bg-purple-50/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Total Hours Studied</p>
              <p className="text-2xl font-bold text-purple-600">{totalStudyHours}</p>
            </div>
            <div className="p-3 bg-purple-50/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Topics Covered</p>
              <p className="text-2xl font-bold text-purple-600">{topics.size}</p>
            </div>
          </div>

          {topics.size > 0 && (
            <div>
              <p className="text-sm font-semibold mb-2">Topics</p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {Array.from(topics).slice(0, 5).map(topic => (
                  <div
                    key={topic}
                    className="p-2 bg-purple-50/50 rounded-lg border border-purple-200/50 text-sm"
                  >
                    {topic}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* ---------------- FULL-WIDTH CHARTS ---------------- */}
      <div className="space-y-6 mt-6">
        {/* Cardio */}
        {dayWiseData.some(d => d.gymCardio > 0) && (
          <div className="w-full h-96 bg-white rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-semibold mb-2">Cardio Progress by Day</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dayWiseData
                  .filter(d => d.gymCardio > 0)
                  .map(d => ({ ...d, displayDate: formatDateShort(d.date) }))}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="displayDate" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="gymCardio" fill="#f59e0b" name="Cardio (min)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Protein */}
        {dayWiseData.some(d => d.dietProtein > 0) && (
          <div className="w-full h-96 bg-white rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-semibold mb-2">Protein Intake by Day</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dayWiseData
                  .filter(d => d.dietProtein > 0)
                  .map(d => ({ ...d, displayDate: formatDateShort(d.date) }))}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="displayDate" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="dietProtein" fill="#22c55e" name="Protein (g)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Study Hours */}
        {dayWiseData.some(d => d.studyHours > 0) && (
          <div className="w-full h-96 bg-white rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-semibold mb-2">Study Hours by Day</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dayWiseData
                  .filter(d => d.studyHours > 0)
                  .map(d => ({ ...d, displayDate: formatDateShort(d.date) }))}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="displayDate" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="studyHours" fill="#a855f7" name="Study Hours" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}