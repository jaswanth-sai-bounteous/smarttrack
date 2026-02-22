import { NavLink } from "react-router-dom"
import { Button } from "../ui/button"

const links = [
  { name: "Gym", path: "/gym" },
  { name: "Diet", path: "/diet" },
  { name: "Study", path: "/study" },
  { name: "Track", path: "/track" },
]

export function Sidebar() {
  return (
    <div className="w-60 h-screen border-r p-6 space-y-6">
      <h1 className="text-xl font-bold">Tracker</h1>

      <div className="space-y-2">
        {links.map(link => (
          <NavLink key={link.path} to={link.path}>
            {({ isActive }) => (
              <Button
                variant={isActive ? "default" : "ghost"}
                className="w-full justify-start"
              >
                {link.name}
              </Button>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  )
}