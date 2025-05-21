"use client";

import Sidebar from "../../frames/SideBar";
import { Bell, User, LogOut } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/items/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/items/ui/dropdown-menu";
import { Badge } from "@/components/items/ui/Badge";
import { logout } from "@/lib/auth";

export default function MainLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name: string; email: string; role: string } | null;
}) {
  const email = user?.email || "email@example.com";

  const notifications = [
    {
      id: 1,
      label: "Notificación 1",
      description: "Descripción de la notificación 1",
      date: "2h",
    },
    {
      id: 2,
      label: "Notificación 2",
      description: "Descripción de la notificación 2",
      date: "1min",
    },
  ];

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
                    {notifications.length > 0 && (
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
                    <button className="text-sm text-primary hover:text-secondary hover:cursor-pointer">
                      Marcar todo como leído
                    </button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-2 bg-secondary rounded-lg ">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{n.label}</p>
                            <p className="text-sm text-white">
                              {n.description}
                            </p>
                          </div>
                          <span className="text-xs text-white">{n.date}</span>
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
  );
}
