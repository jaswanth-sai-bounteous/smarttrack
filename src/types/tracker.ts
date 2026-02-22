export type MuscleGroup =
  | "Chest"
  | "Back"
  | "Triceps"
  | "Legs"
  | "Shoulders"
  | "Biceps"
  | "Abs"
/* ---------------- GYM ---------------- */

export interface GymDay {
  id: string
  date: string
  muscleGroups: MuscleGroup[]
  cardioMinutes: number
}

/* ---------------- DIET ---------------- */

export interface DietEntry {
  id: string
  food: string
  protein: number
}

export interface DietDay {
  id: string
  date: string
  entries: DietEntry[]
}

/* ---------------- STUDY ---------------- */

// Update StudyDay
export interface StudyDay {
  id: string
  date: string
  topic: string
  hours: number   // ✅ new property
}

/* ---------------- ROOT STATE ---------------- */

export interface TrackerState {
  gymDays: GymDay[]
  dietDays: DietDay[]
  studyDays: StudyDay[]
}