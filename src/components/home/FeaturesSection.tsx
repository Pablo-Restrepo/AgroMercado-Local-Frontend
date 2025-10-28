import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Users, Leaf, TrendingUp } from "lucide-react";

const features = [
    {
        icon: <ShoppingCart className="h-8 w-8 text-green-600" />,
        title: "Compra Directa",
        description: "Conecta directamente con productores locales sin intermediarios"
    },
    {
        icon: <Users className="h-8 w-8 text-blue-600" />,
        title: "Comunidad Local",
        description: "Apoya a los agricultores de tu región y fortalece la economía local"
    },
    {
        icon: <Leaf className="h-8 w-8 text-emerald-600" />,
        title: "Productos Frescos",
        description: "Alimentos recién cosechados con la máxima frescura garantizada"
    },
    {
        icon: <TrendingUp className="h-8 w-8 text-orange-600" />,
        title: "Precios Justos",
        description: "Mejores precios para consumidores y productores"
    }
];

export function FeaturesSection() {
    return (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
            <div className="text-center space-y-4 mb-12 sm:mb-16">
                <Badge variant="success" className="mb-4">Características</Badge>
                <h2 className="text-3xl sm:text-4xl font-bold px-4">¿Por qué elegir AgroMercado?</h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
                    Una plataforma diseñada para revolucionar la forma en que compras alimentos frescos en Popayán
                </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {features.map((feature, index) => (
                    <Card key={index} className="border-2 hover:border-green-600 transition-colors">
                        <CardContent className="pt-6 space-y-4">
                            <div className="h-16 w-16 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold">{feature.title}</h3>
                            <p className="text-sm sm:text-base text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}