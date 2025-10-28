import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export function CTASection() {
    return (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
            <Card className="bg-gradient-to-r from-green-600 to-blue-600 border-none text-white">
                <CardContent className="p-8 sm:p-12 text-center space-y-6">
                    <h2 className="text-3xl sm:text-4xl font-bold">
                        ¿Listo para empezar?
                    </h2>
                    <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto">
                        Únete a nuestra comunidad de productores y consumidores comprometidos
                        con la agricultura sostenible en Popayán
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" variant="secondary" className="w-full sm:w-auto" asChild>
                            <Link to="/registro">
                                Crear Cuenta
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white/10"
                            asChild
                        >
                            <Link to="/contacto">
                                Contactar
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}