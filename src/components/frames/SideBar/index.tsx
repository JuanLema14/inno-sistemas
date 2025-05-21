import Image from 'next/image'
import SidebarLinks from './SidebarLinks'

export default function Sidebar() {
  return (
    <aside className="bg-accent h-150 w-64 p-6 rounded-xl flex flex-col shadow-md">
      {/* Logo y título */}
      <div className="flex items-center gap-3 mb-8">
        <Image src="/img/logo.png" alt="Logo" width={40} height={40} />
        <h1 className="text-primary text-md font-bold">Sistemas</h1>
      </div>

      {/* Enlaces */}
      <SidebarLinks />
    </aside>
  )
}
