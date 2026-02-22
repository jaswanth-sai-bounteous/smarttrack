import { useState } from "react"
import { NavLink } from "react-router-dom"
import { Button } from "../ui/button"

const links = [
  { name: "Gym", path: "/gym" },
  { name: "Diet", path: "/diet" },
  { name: "Study", path: "/study" },
  { name: "Track", path: "/track" },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={`h-screen border-r p-6 space-y-6 transition-all duration-300 ${
        collapsed ? "w-20" : "w-60"
      }`}
    >
      {/* Header with toggle button */}
      <div className="flex items-center justify-between">
        {!collapsed && <h1 className="text-xl font-bold">Tracker</h1>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded hover:bg-gray-200 transition"
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Links */}
      <div className="space-y-2">
        {links.map(link => (
          <NavLink key={link.path} to={link.path}>
            {({ isActive }) => (
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start transition-all duration-300 ${
                  collapsed ? "justify-center" : ""
                }`}
              >
                {/* Show icon or first letter when collapsed */}
                {collapsed ? link.name[0] : link.name}
              </Button>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  )
}