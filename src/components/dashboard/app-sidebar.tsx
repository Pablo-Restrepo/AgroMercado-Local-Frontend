"use client"

import * as React from "react"
import {
  Package,
  Plus,
  Send,
  Warehouse,
  Filter,
  Settings,
  HelpCircle,
  Leaf,
} from "lucide-react"

import { NavUser } from "@/components/dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"

import { getCurrentUser } from "@/services/api/userApi"
import { authStorage } from "@/services/storage/authStorage"
import type { User } from "@/types/auth" 

type SidebarUser = {
  name: string
  email: string
  avatar: string
  role?: User["u_rol"]
}

const data = {
  user: {
    name: "Jonathan Guejia",
    email: "jonathan@agromercado.com",
    avatar: "/avatars/jonathan.jpg",
  },
  navMain: [
    {
      title: "Mis productos",
      url: "/dashboard/productos",
      icon: Package,
    },
    {
      title: "Crear producto",
      url: "/dashboard/crear-producto",
      icon: Plus,
    },
    {
      title: "Gestionar envíos",
      url: "/dashboard/envios",
      icon: Send,
    },
    {
      title: "Mi gremio",
      url: "/dashboard/gremio",
      icon: Warehouse,
    },
  ],
  categories: [
    { id: "todo", label: "Todo" },
    { id: "frutas", label: "Frutas" },
    { id: "verduras", label: "Verduras" },
    { id: "medicinales", label: "Medicinales" },
    { id: "tuberculos", label: "Tubérculos" },
    { id: "hierbas", label: "Hierbas" },
  ],
  navSecondary: [
    {
      title: "Configuraciones",
      url: "/dashboard/configuraciones",
      icon: Settings,
    },
    {
      title: "Ayuda",
      url: "/dashboard/ayuda",
      icon: HelpCircle,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [selectedCategory, setSelectedCategory] = React.useState("todo")
  const [priceRange, setPriceRange] = React.useState([0])

  // usar user guardado en localStorage como inicial (si existe), sino fallback quemado
  const initialUser = React.useMemo(() => {
    const stored = authStorage.getUser()
    if (stored) {
      return {
        name: stored.u_nombre_usuario,
        email: stored.u_email,
        avatar: `/avatars/${stored.u_id}.jpg`,
        role: stored.u_rol, // <-- ahora guardamos rol si existe en storage
      } as SidebarUser
    }
    return {
      name: data.user.name,
      email: data.user.email,
      avatar: data.user.avatar,
    } as SidebarUser
  }, [])

  const [currentUser, setCurrentUser] = React.useState<SidebarUser>(() => initialUser)

  React.useEffect(() => {
    const token = authStorage?.getAccessToken?.()
    if (!token) return

    let mounted = true

    // normalizar rol del backend a los enums usados en frontend
    function normalizeRole(role?: string): User["u_rol"] {
      if (!role) return "cliente"
      if (role.includes("admin")) return "admin"
      if (role.includes("productor")) return "productor"
      return "cliente"
    }

    getCurrentUser()
      .then((u) => {
        if (!mounted) return
        const mapped: SidebarUser = {
          name: `${u.nombres} ${u.apellidos}`,
          email: u.email,
          avatar: `/avatars/${u.u_id}.jpg`, // placeholder; cambia cuando tengas ruta real
          role: normalizeRole(u.rol), // <-- guardo rol aquí pero no lo muestro en NavUser
        }
        setCurrentUser(mapped)

        // guardar usuario normalizado en authStorage para uso en otras partes
        try {
          const userToStore: User = {
            u_id: u.u_id,
            u_nombre_usuario: mapped.name,
            u_email: u.email,
            u_rol: mapped.role ?? "cliente",
          }
          authStorage.setUser(userToStore)
        } catch {
          // no bloquear si falla el guardado
        }
      })
      .catch(() => {
        // mantener usuario quemado si falla
      })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard" className="flex items-center gap-2">
                <div className="bg-green-600 text-white flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Leaf className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">AgroMercado Local</span>
                  <span className="truncate text-xs text-muted-foreground">Plataforma</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        {/* Navigation Main */}
        <div className="space-y-1 py-2">
          {data.navMain.map((item) => (
            <SidebarMenuButton key={item.title} asChild className="w-full justify-start">
              <a href={item.url} className="flex items-center gap-3">
                <item.icon className="size-4" />
                <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
              </a>
            </SidebarMenuButton>
          ))}
        </div>

        <Separator className="my-4" />

        {/* Filters Section */}
        <div className="space-y-4 group-data-[collapsible=icon]:hidden">
          <div className="px-2">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="size-4" />
              <Label className="text-sm font-medium">Filtros</Label>
            </div>
            
            {/* Categories */}
            <div className="space-y-3">
              <Label className="text-xs font-medium text-muted-foreground">Categoría</Label>
              <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-2">
                {data.categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={category.id} id={category.id} className="size-4" />
                    <Label htmlFor={category.id} className="text-sm cursor-pointer">
                      {category.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <Separator className="my-4" />

            {/* Price Range */}
            <div className="space-y-3">
              <Label className="text-xs font-medium text-muted-foreground">Rango de Precio</Label>
              <div className="px-2">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={50000}
                  step={1000}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>$0</span>
                  <span>${priceRange[0].toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Navigation */}
        <div className="mt-auto space-y-1 py-2">
          <Separator className="mb-2" />
          {data.navSecondary.map((item) => (
            <SidebarMenuButton key={item.title} asChild className="w-full justify-start">
              <a href={item.url} className="flex items-center gap-3">
                <item.icon className="size-4" />
                <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
              </a>
            </SidebarMenuButton>
          ))}
        </div>
      </SidebarContent>
      
      <SidebarFooter>
        <NavUser user={currentUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
