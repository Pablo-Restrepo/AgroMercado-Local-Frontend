import * as React from "react"
import {
  Package,
  Plus,
  Send,
  Warehouse,
  Filter,
  Settings,
  HelpCircle,
  LogIn,
  Loader2,
  Users,
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
import { getProductorByUserId, type ProductorResponse } from "@/services/api/productoresApi"
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
      url: "/dashboard/mi-gremio",
      icon: Warehouse,
    },
  ],
  createGremioNav: {
    title: "Crear gremio",
    url: "/dashboard/crear-gremio",
    icon: Users,
  },
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
  hideFilters?: boolean
}

export function AppSidebar({ onFilterChange, hideFilters = false, ...props }: AppSidebarProps) {
  const [selectedCategory, setSelectedCategory] = React.useState("todo")
  const [priceRange, setPriceRange] = React.useState([0])
  const { isAuthenticated, user: authUser, isLoading } = useAuth()
  const { handleSessionExpired } = useSessionHandler()
  const [productorData, setProductorData] = React.useState<ProductorResponse | null>(null)
  const [currentUser, setCurrentUser] = React.useState<SidebarUser | null>(null)

  // Determinar rol efectivo usando el currentUser actualizado
  const effectiveRole: User["u_rol"] = React.useMemo(() => {
    if (currentUser?.role) return currentUser.role
    if (authUser?.u_rol) return authUser.u_rol
    return authStorage.getUser()?.u_rol ?? "cliente"
  }, [currentUser, authUser])

  // Si está cargando, mostrar estado de carga
  if (isLoading) {
    return (
      <Sidebar variant="inset" collapsible="icon" {...props}>
        <SidebarContent className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-green-600" />
        </SidebarContent>
      </Sidebar>
    )
  }

  // Menús por rol - ACTUALIZADO
  const clienteNav = [
    { title: "Productos Disponibles", url: "/dashboard/compras", icon: Package },
    { title: "Mis pedidos", url: "/dashboard/mis-pedidos", icon: Send },
  ]

  // Filtrar "Mi gremio" si el productor no tiene gremio, y reemplazarlo por "Crear gremio"
  const productorNav = React.useMemo(() => {
    if (!productorData) {
      // Si aún no tenemos datos del productor, mostrar todo
      return data.navMain
    }

    // Si tiene gremio, mostrar todo; si no, reemplazar "Mi gremio" por "Crear gremio"
    if (productorData.id_gremio !== null) {
      return data.navMain
    } else {
      return data.navMain.map(item =>
        item.title === "Mi gremio" ? data.createGremioNav : item
      )
    }
  }, [productorData])

  const navMainForRole = (effectiveRole === "productor" || effectiveRole === "admin")
    ? productorNav
    : clienteNav

  // Usar usuario del contexto de auth si existe, sino valores por defecto
  const initialUser = React.useMemo((): SidebarUser => {
    if (authUser) {
      return {
        name: authUser.u_nombre_usuario,
        email: authUser.u_email,
        avatar: `https://ui.shadcn.com/avatars/0${(authUser.u_id % 5) + 1}.png`,
        role: authUser.u_rol,
      }
    }

    const stored = authStorage.getUser()
    if (stored && isAuthenticated) {
      return {
        name: stored.u_nombre_usuario,
        email: stored.u_email,
        avatar: `https://ui.shadcn.com/avatars/0${(stored.u_id % 5) + 1}.png`,
        role: stored.u_rol,
      }
    }

    return {
      name: "Usuario",
      email: "usuario@example.com",
      avatar: "https://ui.shadcn.com/avatars/01.png",
    }
  }, [authUser, isAuthenticated])

  // Inicializar currentUser con initialUser
  React.useEffect(() => {
    if (!currentUser) {
      setCurrentUser(initialUser)
    }
  }, [initialUser, currentUser])

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

    // FIX: Función para normalizar roles de la BD
    function normalizeRole(role?: string): User["u_rol"] {
      if (!role) return "cliente"
      const roleUpper = role.toUpperCase()
      if (roleUpper.includes("ADMIN")) return "admin"
      if (roleUpper.includes("PRODUCTOR")) return "productor"
      if (roleUpper.includes("CLIENTE")) return "cliente"
      return "cliente"
    }

    getCurrentUser()
      .then((u) => {
        if (!mounted) return
        const mapped: SidebarUser = {
          name: `${u.nombres} ${u.apellidos}`,
          email: u.email,
          avatar: `https://ui.shadcn.com/avatars/0${(u.u_id % 5) + 1}.png`,
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

        // Si el usuario es productor, obtener datos del productor para verificar si tiene gremio
        console.log('Rol del usuario:', mapped.role)
        console.log('User ID:', u.u_id)
        if (mapped.role === "productor" || mapped.role === "admin") {
          console.log('Llamando a getProductorByUserId...')
          getProductorByUserId(u.u_id)
            .then((productor) => {
              if (!mounted) return
              console.log('Datos del productor:', productor)
              setProductorData(productor)
            })
            .catch((error) => {
              console.error('Error al obtener productor:', error)
              // Si falla, no bloquear la UI
            })
        } else {
          console.log('El usuario no es productor ni admin, no se busca información de gremio')
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
                <img src="/logo.svg" alt="AgroMercado" className="size-8" />
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
        {
          isAuthenticated ? (
            <>
              {/* Navigation Main */}
              <div className="space-y-1 pt-2">
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
              {!hideFilters && (
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
              )}

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
        {isAuthenticated && currentUser ? (
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