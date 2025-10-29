import * as React from "react"
import { ProductFilters, type FilterState } from "@/components/products/ProductFilters"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onFilterChange?: (filters: FilterState) => void
}

export function AppSidebar({ onFilterChange, ...props }: AppSidebarProps) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <img src="/logo.svg" alt="AgroMercado" className="h-8 w-8" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">AgroMercado</span>
                  <span className="truncate text-xs">Plataforma</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator orientation="horizontal" className="px-4" />
      <SidebarContent className="px-4">
        <div className="py-4">
          <h2 className="mb-4 text-lg font-semibold">Filtros</h2>
          <ProductFilters onFilterChange={onFilterChange} />
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
