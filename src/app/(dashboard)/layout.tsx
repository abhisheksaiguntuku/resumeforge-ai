import { auth } from "@/lib/auth"
import Link from "next/link"
import { redirect } from "next/navigation"
import {
  LayoutDashboard,
  User,
  Upload,
  Briefcase,
  FileText,
  Layout,
  Settings,
  LogOut,
  Menu,
} from "lucide-react"
import { CareerCoach } from "@/components/chat/CareerCoach"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) {
    redirect("/login")
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Career Profile", href: "/profile", icon: User },
    { name: "Upload Resumes", href: "/profile/upload", icon: Upload },
    { name: "Add Job", href: "/jobs/new", icon: Briefcase },
    { name: "My Resumes", href: "/resumes", icon: FileText },
    { name: "Templates", href: "/templates", icon: Layout },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  return (
    <div className="flex min-h-screen bg-[#0a0a0f] text-slate-200">
      {/* Sidebar - Desktop */}
      <aside className="hidden w-64 flex-col border-r border-[#2a2a3a] bg-[#12121a] md:flex">
        <div className="flex h-16 items-center px-6">
          <Link href="/dashboard" className="text-xl font-bold text-indigo-500">
            ResumeForge AI
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-[#1f1f2e] hover:text-white"
              >
                <item.icon
                  className="mr-3 h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-indigo-400"
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-[#2a2a3a] bg-[#12121a] px-4 md:px-6">
          <div className="flex items-center md:hidden">
            <button className="text-slate-400 hover:text-white focus:outline-none">
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
            <span className="ml-4 text-lg font-bold text-indigo-500">
              ResumeForge
            </span>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-slate-300">
                {session.user.name || "User"}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
                {session.user.name?.[0]?.toUpperCase() || "U"}
              </div>
            </div>
            <Link
              href="/api/auth/signout"
              className="rounded-md p-2 text-slate-400 hover:bg-[#1f1f2e] hover:text-white"
            >
              <LogOut className="h-5 w-5" />
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
      <CareerCoach />
    </div>
  )
}
