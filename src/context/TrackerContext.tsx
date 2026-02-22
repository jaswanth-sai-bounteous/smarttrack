import React, { createContext, useContext, useEffect, useState } from "react"
import type { TrackerState, GymDay, StudyDay } from "../types/tracker"
import { v4 as uuid } from "uuid"

interface TrackerContextType {
  state: TrackerState

  // CREATE
  addGymDay: (data: Omit<GymDay, "id">) => void
  addDietDay: (date: string) => void
  addDietEntry: (dayId: string, food: string, protein: number) => void
  addStudyDay: (data: Omit<StudyDay, "id">) => void

  // DELETE
  deleteGymDay: (id: string) => void
  deleteDietDay: (id: string) => void
  deleteDietEntry: (dayId: string, entryId: string) => void
  deleteStudyDay: (id: string) => void

  // EDIT
  editGymDay: (id: string, updated: Omit<GymDay, "id">) => void
  editDietEntry: (
    dayId: string,
    entryId: string,
    updated: { food: string; protein: number }
  ) => void
  editStudyDay: (id: string, updated: Omit<StudyDay, "id">) => void

  clearAllData: () => void
}

const TrackerContext = createContext<TrackerContextType | undefined>(undefined)

const STORAGE_KEY = "tracker_app_data"

const initialState: TrackerState = {
  gymDays: [],
  dietDays: [],
  studyDays: [],
}

export const TrackerProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<TrackerState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : initialState
    } catch {
      return initialState
    }
  })

  /* ---------------- PERSISTENCE ---------------- */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  /* ---------------- CREATE ---------------- */
  const addGymDay = (data: Omit<GymDay, "id">) => {
    setState(prev => ({
      ...prev,
      gymDays: [...prev.gymDays, { id: uuid(), ...data }],
    }))
  }

  const addDietDay = (date: string) => {
    setState(prev => ({
      ...prev,
      dietDays: [...prev.dietDays, { id: uuid(), date, entries: [] }],
    }))
  }

  const addDietEntry = (dayId: string, food: string, protein: number) => {
    setState(prev => ({
      ...prev,
      dietDays: prev.dietDays.map(day =>
        day.id === dayId
          ? {
              ...day,
              entries: [...day.entries, { id: uuid(), food, protein }],
            }
          : day
      ),
    }))
  }

  const addStudyDay = (data: Omit<StudyDay, "id">) => {
    // data must include { date, topic, hours }
    setState(prev => ({
      ...prev,
      studyDays: [...prev.studyDays, { id: uuid(), ...data }],
    }))
  }

  /* ---------------- DELETE ---------------- */
  const deleteGymDay = (id: string) => {
    setState(prev => ({
      ...prev,
      gymDays: prev.gymDays.filter(day => day.id !== id),
    }))
  }

  const deleteDietDay = (id: string) => {
    setState(prev => ({
      ...prev,
      dietDays: prev.dietDays.filter(day => day.id !== id),
    }))
  }

  const deleteDietEntry = (dayId: string, entryId: string) => {
    setState(prev => ({
      ...prev,
      dietDays: prev.dietDays.map(day =>
        day.id === dayId
          ? { ...day, entries: day.entries.filter(e => e.id !== entryId) }
          : day
      ),
    }))
  }

  const deleteStudyDay = (id: string) => {
    setState(prev => ({
      ...prev,
      studyDays: prev.studyDays.filter(day => day.id !== id),
    }))
  }

  /* ---------------- EDIT ---------------- */
  const editGymDay = (id: string, updated: Omit<GymDay, "id">) => {
    setState(prev => ({
      ...prev,
      gymDays: prev.gymDays.map(day => (day.id === id ? { id, ...updated } : day)),
    }))
  }

  const editDietEntry = (
    dayId: string,
    entryId: string,
    updated: { food: string; protein: number }
  ) => {
    setState(prev => ({
      ...prev,
      dietDays: prev.dietDays.map(day =>
        day.id === dayId
          ? {
              ...day,
              entries: day.entries.map(entry =>
                entry.id === entryId ? { ...entry, ...updated } : entry
              ),
            }
          : day
      ),
    }))
  }

  const editStudyDay = (id: string, updated: Omit<StudyDay, "id">) => {
    // updated must include { date, topic, hours }
    setState(prev => ({
      ...prev,
      studyDays: prev.studyDays.map(day => (day.id === id ? { id, ...updated } : day)),
    }))
  }

  /* ---------------- CLEAR ---------------- */
  const clearAllData = () => {
    localStorage.removeItem(STORAGE_KEY)
    setState(initialState)
  }

  return (
    <TrackerContext.Provider
      value={{
        state,
        addGymDay,
        addDietDay,
        addDietEntry,
        addStudyDay,
        deleteGymDay,
        deleteDietDay,
        deleteDietEntry,
        deleteStudyDay,
        editGymDay,
        editDietEntry,
        editStudyDay,
        clearAllData,
      }}
    >
      {children}
    </TrackerContext.Provider>
  )
}

export const useTracker = () => {
  const context = useContext(TrackerContext)
  if (!context) throw new Error("useTracker must be used inside TrackerProvider")
  return context
}