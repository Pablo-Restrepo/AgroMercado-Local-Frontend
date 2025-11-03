import { ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface DashboardLayoutProps {
  children: ReactNode
  title?: string
  showBackButton?: boolean
  backUrl?: string
}

export function DashboardLayout({ 
  children, 
  title, 
  showBackButton = false,
  backUrl 
}: DashboardLayoutProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (backUrl) {
      navigate(backUrl)
    } else {
      navigate(-1)
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
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
  )
}