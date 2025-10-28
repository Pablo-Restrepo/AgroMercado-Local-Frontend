import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted px-4">
            <div className="text-center space-y-8 max-w-2xl">
                {/* 404 Number */}
                <div className="relative flex items-center justify-center gap-0">
                    <span className="text-9xl md:text-[12rem] font-bold text-primary/40 select-none">
                        4
                    </span>
                    <img src="/logo.svg" alt="AgroMercado" className="h-24 w-24 md:h-40 md:w-40 opacity-4   0" />
                    <span className="text-9xl md:text-[12rem] font-bold text-primary/40 select-none">
                        4
                    </span>
                </div>

                {/* Message */}
                <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Página no encontrada
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-md mx-auto">
                        Lo sentimos, la página que buscas no existe o ha sido movida.
                        Parece que te has perdido en el campo.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                    <Button asChild size="lg" className="min-w-[200px]">
                        <Link to="/">
                            Volver al inicio
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="min-w-[200px]">
                        <Link to="/products">
                            Ver productos
                        </Link>
                    </Button>
                </div>

                {/* Additional Help */}
                <div className="pt-8 text-sm text-muted-foreground">
                    <p>¿Necesitas ayuda? <Link to="/contact" className="text-primary hover:underline">Contáctanos</Link></p>
                </div>
            </div>
        </div>
    )
}
