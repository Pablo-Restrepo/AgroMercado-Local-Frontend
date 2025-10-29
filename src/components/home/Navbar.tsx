import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet"
import { Menu, ShoppingBag, Users, Package, Home } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/hooks/auth/useAuth"
import { UserMenu } from "@/components/auth/UserMenu"

const navigationItems = [
    {
        title: "Inicio",
        href: "/",
        icon: Home,
    },
    {
        title: "Productos",
        href: "/productos",
        icon: Package,
        description: "Explora productos frescos y locales",
    },
    {
        title: "Productores",
        href: "/productores",
        icon: Users,
        description: "Conoce a nuestros agricultores",
    },
    {
        title: "Mercado",
        href: "/mercado",
        icon: ShoppingBag,
        description: "Compra directo del productor",
    },
]

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const { isAuthenticated } = useAuth()

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <img src="/logo.svg" alt="AgroMercado" className="h-8 w-8" />
                    <span className="text-xl font-bold hidden sm:inline-block">AgroMercado</span>
                    <span className="text-xl font-bold sm:hidden">AgroMercado</span>
                </Link>

                {/* Desktop Navigation */}
                <NavigationMenu className="hidden lg:flex">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                href="/"
                                className="group inline-flex h-10 items-center justify-center px-4 py-2">
                                Inicio
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="bg-transparent hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">Productos</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                    <li className="row-span-3">
                                        <NavigationMenuLink asChild>
                                            <Link
                                                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                                to="/productos"
                                            >
                                                <Package className="h-6 w-6 mb-2" />
                                                <div className="mb-2 mt-4 text-lg font-medium">
                                                    Productos Frescos
                                                </div>
                                                <p className="text-sm leading-tight text-muted-foreground">
                                                    Descubre productos orgánicos directo de la granja
                                                </p>
                                            </Link>
                                        </NavigationMenuLink>
                                    </li>
                                    <li>
                                        <NavigationMenuLink asChild>
                                            <Link
                                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                to="/productos/frutas"
                                            >
                                                <div className="text-sm font-medium leading-none">Frutas</div>
                                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                    Frutas de temporada
                                                </p>
                                            </Link>
                                        </NavigationMenuLink>
                                    </li>
                                    <li>
                                        <NavigationMenuLink asChild>
                                            <Link
                                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                to="/productos/verduras"
                                            >
                                                <div className="text-sm font-medium leading-none">Verduras</div>
                                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                    Verduras orgánicas
                                                </p>
                                            </Link>
                                        </NavigationMenuLink>
                                    </li>
                                    <li>
                                        <NavigationMenuLink asChild>
                                            <Link
                                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                to="/productos/lacteos"
                                            >
                                                <div className="text-sm font-medium leading-none">Lácteos</div>
                                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                    Productos lácteos frescos
                                                </p>
                                            </Link>
                                        </NavigationMenuLink>
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink
                                href="/productores"
                                className="group inline-flex h-10 items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                                Productores
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink
                                href="/mercado"
                                className="group inline-flex h-10 items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                                Mercado
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                {/* Desktop CTA Buttons & Theme Toggle */}
                <div className="hidden lg:flex items-center gap-3">
                    <ModeToggle />
                    {isAuthenticated ? (
                        <>
                            <Button variant="ghost" asChild>
                                <Link to="/dashboard">Dashboard</Link>
                            </Button>
                            <UserMenu />
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" asChild>
                                <Link to="/login">Iniciar Sesión</Link>
                            </Button>
                            <Button asChild>
                                <Link to="/registro">Registrarse</Link>
                            </Button>
                        </>
                    )}
                </div>

                {/* Mobile/Tablet Actions */}
                <div className="flex lg:hidden items-center gap-2">
                    <ModeToggle />
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Abrir menú</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[320px] sm:w-[400px]">
                            <SheetTitle className="sr-only">
                                menu
                            </SheetTitle>
                            <nav className="flex flex-col h-full">
                                {/* Logo Section */}
                                <div className="flex items-center gap-3 px-4 py-4 border-b">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 flex-shrink-0">
                                        <img src="/logo.svg" alt="AgroMercado" className="h-8 w-8" />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <span className="text-lg font-bold leading-tight">AgroMercado</span>
                                        <span className="text-xs text-muted-foreground leading-tight">Tu mercado directo</span>
                                    </div>
                                </div>

                                {/* Navigation Links */}
                                <div className="flex-1 overflow-y-auto px-4">
                                    <div className="space-y-1 py-4">
                                        {navigationItems.map((item) => (
                                            <Button
                                                key={item.href}
                                                variant="ghost"
                                                className="group w-full justify-start gap-3 rounded-xl h-auto px-0 py-3 text-sm font-medium bg-transparent border-0 hover:bg-accent hover:px-3 transition-all duration-200 dark:hover:bg-accent/50"
                                                onClick={() => setIsOpen(false)}
                                                asChild
                                            >
                                                <Link to={item.href}>
                                                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors flex-shrink-0">
                                                        <item.icon className="h-5 w-5" />
                                                    </div>
                                                    <div className="flex flex-col gap-0.5 flex-1 min-w-0 text-left">
                                                        <span className="font-semibold group-hover:text-primary transition-colors">
                                                            {item.title}
                                                        </span>
                                                        {item.description && (
                                                            <span className="text-xs text-muted-foreground leading-snug">
                                                                {item.description}
                                                            </span>
                                                        )}
                                                    </div>
                                                </Link>
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {/* CTA Buttons */}
                                <div className="px-4 py-4 border-t bg-muted/30">
                                    {isAuthenticated ? (
                                        <div className="space-y-2.5">
                                            <Button
                                                variant="outline"
                                                className="w-full h-10 font-semibold"
                                                onClick={() => setIsOpen(false)}
                                                asChild
                                            >
                                                <Link to="/dashboard">Dashboard</Link>
                                            </Button>
                                            <UserMenu isMobile />
                                        </div>
                                    ) : (
                                        <div className="space-y-2.5">
                                            <Button
                                                variant="outline"
                                                className="w-full h-10 font-semibold"
                                                onClick={() => setIsOpen(false)}
                                                asChild
                                            >
                                                <Link to="/login">Iniciar Sesión</Link>
                                            </Button>
                                            <Button
                                                className="w-full h-10 font-semibold shadow-sm"
                                                onClick={() => setIsOpen(false)}
                                                asChild
                                            >
                                                <Link to="/registro">Registrarse</Link>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header >
    )
}