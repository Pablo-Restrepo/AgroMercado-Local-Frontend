import { HandHeart, Clock, MapPin, TrendingUp } from "lucide-react";

const stats = [
    { value: "100%", label: "Compromiso Local", icon: <HandHeart className="h-6 w-6" /> },
    { value: "24-48h", label: "Entrega Rápida", icon: <Clock className="h-6 w-6" /> },
    { value: "Popayán", label: "Ciudad Blanca", icon: <MapPin className="h-6 w-6" /> },
    { value: "0%", label: "Comisiones", icon: <TrendingUp className="h-6 w-6" /> }
];

export function StatsSection() {
    return (
        <section className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-y bg-white dark:bg-gray-800/50">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
                {stats.map((stat, index) => (
                    <div key={index} className="text-center space-y-3">
                        <div className="flex justify-center text-green-600">
                            {stat.icon}
                        </div>
                        <p className="text-3xl sm:text-4xl font-bold text-green-600">{stat.value}</p>
                        <p className="text-sm sm:text-base text-muted-foreground">{stat.label}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}