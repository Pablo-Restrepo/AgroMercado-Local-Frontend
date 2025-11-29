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
  LogIn,
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
import { Button } from "@/components/ui/button"

import { getCurrentUser } from "@/services/api/userApi"
import { AuthError } from "@/services/api/authFetch"
import { authStorage } from "@/services/storage/authStorage"
import { useAuth } from "@/hooks/auth/useAuth"
import { useSessionHandler } from "@/hooks/auth/useSessionHandler"
import type { User } from "@/types/auth" 

type SidebarUser = {
  name: string
  email: string
  avatar: string
  role?: User["u_rol"]
}

const data = {
  navMain: [
    {
      title: "Mis productos",
      url: "/dashboard/mis-productos",
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

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onFilterChange?: (filters: { selectedCategory: string; priceRange: number[] }) => void
}

export function AppSidebar({ onFilterChange, ...props }: AppSidebarProps) {
  const [selectedCategory, setSelectedCategory] = React.useState("todo")
  const [priceRange, setPriceRange] = React.useState([0])
  const { isAuthenticated, user: authUser } = useAuth()
  const { handleSessionExpired } = useSessionHandler()

  // Determinar rol efectivo (preferir contexto, luego storage)
  const effectiveRole: User["u_rol"] =
    authUser?.u_rol ?? authStorage.getUser()?.u_rol ?? "cliente"

  // Menús por rol
  const clienteNav = [
    { title: "Home", url: "/dashboard", icon: Package },
    { title: "Mis pedidos", url: "/dashboard/mis-pedidos", icon: Send },  // Agregar esta línea
  ]

  const productorNav = data.navMain // mantiene el conjunto existente para productor/admin

  const navMainForRole = (effectiveRole === "productor" || effectiveRole === "admin")
    ? productorNav
    : clienteNav  // Cambiar de "productor-admin" a solo "productor"

  // Usar usuario del contexto de auth si existe, sino valores por defecto
  const initialUser = React.useMemo((): SidebarUser => {
    if (authUser) {
      return {
        name: authUser.u_nombre_usuario,
        email: authUser.u_email,
        avatar: `/avatars/${authUser.u_id}.jpg`,
        role: authUser.u_rol,
      }
    }
    
    const stored = authStorage.getUser()
    if (stored && isAuthenticated) {
      return {
        name: stored.u_nombre_usuario,
        email: stored.u_email,
        avatar: `/avatars/${stored.u_id}.jpg`,
        role: stored.u_rol,
      }
    }
    
    return {
      name: "Usuario",
      email: "usuario@example.com",
      avatar: "/avatars/default.jpg",
    }
  }, [authUser, isAuthenticated])

  const [currentUser, setCurrentUser] = React.useState<SidebarUser>(() => initialUser)

  // Notificar cambios de filtros
  const notifyFilterChange = React.useCallback(() => {
    onFilterChange?.({
      selectedCategory,
      priceRange
    })
  }, [selectedCategory, priceRange, onFilterChange])

  React.useEffect(() => {
    notifyFilterChange()
  }, [notifyFilterChange])

  // Solo hacer llamada autenticada si el usuario está logueado
  React.useEffect(() => {
    if (!isAuthenticated) {
      setCurrentUser(initialUser)
      return
    }

    const token = authStorage?.getAccessToken?.()
    if (!token) return

    let mounted = true

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
          avatar: `/avatars/${u.u_id}.jpg`,
          role: normalizeRole(u.rol),
        }
        setCurrentUser(mapped)

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
      .catch((error) => {
        console.warn("Error fetching user data:", error)
        
        // Si es un error de autenticación, manejar sesión expirada
        if (error instanceof AuthError) {
          console.log("Token expirado, cerrando sesión...")
          handleSessionExpired()
        }
        
        // Para otros errores, mantener usuario actual sin hacer nada drástico
      })

    return () => {
      mounted = false
    }
  }, [isAuthenticated, initialUser, handleSessionExpired])

  // Componente para mostrar cuando no está autenticado
  const LoginPrompt = () => (
    <div className="px-4 py-6 text-center">
      <LogIn className="h-12 w-12 mx-auto mb-4 text-gray-400" />
      <h3 className="text-sm font-medium text-gray-900 mb-2">
        Inicia sesión
      </h3>
      <p className="text-xs text-gray-500 mb-4">
        Accede a tu cuenta para ver tus productos y configuraciones
      </p>
      <Button asChild size="sm" className="w-full bg-green-600 hover:bg-green-700">
        <a href="/login">Iniciar sesión</a>
      </Button>
    </div>
  )

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
        {isAuthenticated ? (
          <>
            {/* Navigation Main */}
            <div className="space-y-1 py-2">
              {navMainForRole.map((item) => (
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
          </>
        ) : (
          /* Login Prompt cuando no está autenticado */
          <div className="group-data-[collapsible=icon]:hidden">
            <LoginPrompt />
          </div>
        )}
      </SidebarContent>

      <SidebarFooter>
        {isAuthenticated ? (
          <NavUser user={currentUser} />
        ) : (
          <div className="group-data-[collapsible=icon]:hidden px-2">
            <Button asChild variant="outline" size="sm" className="w-full">
              <a href="/login">Iniciar sesión</a>
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}