import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, MapPin, Clock, ArrowRight } from "lucide-react";

const benefits = [
    "Productos orgánicos y sostenibles",
    "Entrega rápida y segura",
    "Trazabilidad completa",
    "Apoyo a la agricultura local",
    "Sin intermediarios",
    "Precios competitivos"
];

export function BenefitsSection() {
    return (
        <section className="bg-green-50 dark:bg-gray-900 py-12 sm:py-16 md:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    <div className="space-y-6 order-2 lg:order-1">
                        <Badge variant='success'>Beneficios</Badge>
                        <h2 className="text-3xl sm:text-4xl font-bold">
                            Agricultura Sostenible para un Futuro Mejor
                        </h2>
                        <p className="text-base sm:text-lg text-muted-foreground">
                            En AgroMercado Local, creemos en un sistema alimentario más justo y sostenible.
                            Conectamos a productores locales del Cauca con consumidores conscientes de Popayán.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm sm:text-base">{benefit}</span>
                                </div>
                            ))}
                        </div>
                        <Button size="lg" className="w-full sm:w-auto">
                            Conocer Más
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                    <div className="relative order-1 lg:order-2">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl blur-3xl opacity-20" />
                        <Card className="relative">
                            <CardContent className="p-6 sm:p-8 space-y-4 sm:space-y-6">
                                <div className="flex items-start gap-3 sm:gap-4">
                                    <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-base sm:text-lg">Cobertura Local</p>
                                        <p className="text-sm sm:text-base text-muted-foreground">Popayán y zonas rurales del Cauca</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 sm:gap-4">
                                    <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-base sm:text-lg">Entrega Rápida</p>
                                        <p className="text-sm sm:text-base text-muted-foreground">24-48 horas dentro de Popayán</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 sm:gap-4">
                                    <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-base sm:text-lg">Calidad Garantizada</p>
                                        <p className="text-sm sm:text-base text-muted-foreground">Productos verificados y frescos</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}