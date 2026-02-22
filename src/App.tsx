import { Routes, Route, Navigate } from "react-router-dom"
import AppLayout from "./components/layout/AppLayout"
import Gym from "./pages/Gym"
import Diet from "./pages/Diet"
import Study from "./pages/Study"
import Track from "./pages/Track"

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/gym" replace />} />
        <Route path="/gym" element={<Gym />} />
        <Route path="/diet" element={<Diet />} />
        <Route path="/study" element={<Study />} />
        <Route path="/track" element={<Track />} />
      </Route>
    </Routes>
  )
}