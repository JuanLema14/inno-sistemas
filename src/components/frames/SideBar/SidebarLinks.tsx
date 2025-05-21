import { Home, LayoutDashboard, Settings } from 'lucide-react'
import EssentialLink from '@/components/items/EssentialLinks'

export default function SidebarLinks() {
  return (
    <div className="flex flex-col gap-2 p-2">
      <EssentialLink
        title="Inicio"
        link="/main"
        icon={Home}
      />
      <EssentialLink
        title="Panel"
        link="/main/dashboard"
        icon={LayoutDashboard}
      />
      <EssentialLink
        title="Ajustes"
        link="/main/settings"
        icon={Settings}
      />
    </div>
  )
}
