import { ReactNode } from "react"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { NavLink } from "react-router-dom"
import { useAuth } from "@/hooks/auth/useAuth"

interface DashboardLayoutProps {
  children: ReactNode
  title?: string
  showBackButton?: boolean
  backUrl?: string
  onFilterChange?: (filters: { selectedCategory: string; priceRange: number[] }) => void
}

export function DashboardLayout({
  children,
  title,
  showBackButton = false,
  backUrl,
  onFilterChange
}: DashboardLayoutProps) {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleBack = () => {
    if (backUrl) {
      navigate(backUrl)
    } else {
      navigate(-1)
    }
  }

  return (
    <div className="dashboard-layout">
      <SidebarProvider>
        <AppSidebar onFilterChange={onFilterChange} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              
              {showBackButton && (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleBack}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Atrás
                  </Button>
                  <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                  />
                </>
              )}
              
              {title && (
                <h1 className="text-xl font-semibold">{title}</h1>
              )}
            </div>
          </header>
          <div className="flex flex-1 flex-col">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
      <nav className="px-2 py-4">
        {user?.u_rol === "cliente" && (
          <NavLink
            to="/dashboard/envios"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-md ${isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent"}`
            }
          >
            <span>Mis envíos</span>
          </NavLink>
        )}
      </nav>
    </div>
  )
}