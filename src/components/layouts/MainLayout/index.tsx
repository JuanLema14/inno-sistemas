"use client"

import Sidebar from "../../frames/SideBar"
import { Bell, User, LogOut } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/items/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/items/ui/dropdown-menu"
import { Badge } from "@/components/items/ui/Badge"
import { logout } from "@/lib/auth"
import { useEffect, useState } from "react"
import { getNotificationsByUserId, markNotificationAsRead } from "@/services/notification"
import { NotificationDTO } from "@/types/notification"

export default function MainLayout({
  children,
  user,
}: {
  children: React.ReactNode
  user: { name: string; email: string; role: string; userId: number } | null
}) {
  const email = user?.email || "email@example.com"
  const userId = user?.userId || 0

  const [notifications, setNotifications] = useState<NotificationDTO[]>([])

  const fetchNotifications = async () => {
    const notifs = await getNotificationsByUserId()
    setNotifications(notifs)
  }

  useEffect(() => {
    fetchNotifications()
  }, [userId])

  const handleMarkAllAsRead = async () => {
    const unread = notifications.filter(n => !n.isRead)
    await Promise.all(unread.map(n => markNotificationAsRead(n.id)))
    fetchNotifications()
  }

  return (
    <div className="min-h-screen bg-dark text-white p-4">
      <div className="flex gap-6">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="flex items-center justify-between px-6 bg-white rounded-xl p-2 border-b border-accent/20 shadow-md">
            <div className="flex items-center gap-3"></div>

            {/* Acciones */}
            <div className="flex items-center gap-4">
              {/* Notificaciones */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="relative p-2 bg-accent rounded-lg hover:bg-white/10 transition hover:cursor-pointer">
                    <Bell className="h-5 w-5 text-secondary" />
                    {notifications.some(n => !n.isRead) && (
                      <span className="absolute -top-1 -right-1">
                        <Badge className="rounded-full bg-red-500 h-2 w-2 p-0" />
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="bg-accent text-white w-80 rounded-lg shadow-lg p-4 mx-20 mt-2">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-base font-semibold text-secondary">
                      Notificaciones
                    </h2>
                    <button
                      className="text-sm text-primary hover:text-secondary hover:cursor-pointer"
                      onClick={handleMarkAllAsRead}
                    >
                      Marcar todo como leído
                    </button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notifications.length === 0 && (
                      <p className="text-sm text-secondary text-center">
                        No tienes notificaciones
                      </p>
                    )}
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2 rounded-lg ${
                          n.isRead ? "bg-secondary/30" : "bg-secondary"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{n.type}</p>
                            <p className="text-sm text-white">{n.message}</p>
                          </div>
                          <span className="text-xs text-white">
                            {new Date(n.createdAt).toLocaleTimeString("es-ES", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Usuario */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 bg-accent rounded-lg hover:bg-accent/50 transition hover:cursor-pointer">
                    <User className="h-5 w-5 text-secondary" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-accent text-white mt-2 mx-9 rounded-lg shadow-lg w-56">
                  <div className="px-4 py-2 text-sm text-primary border-b border-gray-200">
                    {email}
                  </div>
                  <DropdownMenuItem onClick={logout} className="cursor-pointer hover:bg-dark text-primary">
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Contenido principal */}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
