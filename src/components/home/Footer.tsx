import { Link } from "react-router-dom";

export function Footer() {
    return (
        <footer className="border-t bg-muted/50">
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-2 gap-6 gap-y-8 sm:grid-cols-2 md:grid-cols-4 lg:gap-12">
                    {/* Logo y descripción */}
                    <div className="col-span-2 space-y-3 md:col-span-1">
                        <Link to="/" className="inline-flex items-center gap-2 transition-opacity hover:opacity-80">
                            <img src="/logo.svg" alt="AgroMercado Local" className="h-8 w-8" />
                            <span className="text-lg font-bold tracking-tight">AgroMercado</span>
                        </Link>
                        <p className="text-sm leading-relaxed text-muted-foreground max-w-xs">
                            Conectando el campo caucano con Popayán para un futuro más sostenible
                        </p>
                    </div>

                    {/* Productos */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold tracking-tight">Productos</h3>
                        <ul className="space-y-2.5">
                            <li>
                                <Link
                                    to="/products"
                                    className="text-sm text-muted-foreground transition-colors hover:text-green-600 dark:hover:text-green-500"
                                >
                                    Explorar
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/categories"
                                    className="text-sm text-muted-foreground transition-colors hover:text-green-600 dark:hover:text-green-500"
                                >
                                    Categorías
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/offers"
                                    className="text-sm text-muted-foreground transition-colors hover:text-green-600 dark:hover:text-green-500"
                                >
                                    Ofertas
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Compañía */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold tracking-tight">Compañía</h3>
                        <ul className="space-y-2.5">
                            <li>
                                <Link
                                    to="/about"
                                    className="text-sm text-muted-foreground transition-colors hover:text-green-600 dark:hover:text-green-500"
                                >
                                    Nosotros
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contact"
                                    className="text-sm text-muted-foreground transition-colors hover:text-green-600 dark:hover:text-green-500"
                                >
                                    Contacto
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/faq"
                                    className="text-sm text-muted-foreground transition-colors hover:text-green-600 dark:hover:text-green-500"
                                >
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold tracking-tight">Legal</h3>
                        <ul className="space-y-2.5">
                            <li>
                                <Link
                                    to="/privacy"
                                    className="text-sm text-muted-foreground transition-colors hover:text-green-600 dark:hover:text-green-500"
                                >
                                    Privacidad
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/terms"
                                    className="text-sm text-muted-foreground transition-colors hover:text-green-600 dark:hover:text-green-500"
                                >
                                    Términos
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 border-t pt-8">
                    <p className="text-center text-xs text-muted-foreground sm:text-sm">
                        © 2025 AgroMercado Local - Popayán, Cauca. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}