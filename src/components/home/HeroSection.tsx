import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Leaf, ArrowRight, Star, MapPin } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

export function HeroSection() {
    const plugin = useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true })
    );

    const farmImages = [
        {
            url: "https://images.unsplash.com/photo-1518843875459-f738682238a6?q=80&w=2071&auto=format&fit=crop",
            alt: "Verduras frescas del campo"
        },
        {
            url: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2070&auto=format&fit=crop",
            alt: "Productos del agricultor local"
        },
        {
            url: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2070&auto=format&fit=crop",
            alt: "Canasta de vegetales frescos"
        },
        {
            url: "https://images.unsplash.com/photo-1595855759920-86582396756a?q=80&w=2064&auto=format&fit=crop",
            alt: "Tomates frescos cosechados"
        }
    ];

    return (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-10">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
                    <Badge variant='success'>
                        <Leaf className="h-3 w-3 mr-1" />
                        Conectando Campo y Ciudad en Popayán
                    </Badge>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                        Productos Frescos
                        <span className="text-green-600 block mt-2">Directo del Campo Caucano</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">
                        Plataforma que conecta a agricultores locales de Popayán y el Cauca con consumidores urbanos,
                        promoviendo el comercio justo y la agricultura sostenible.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button size="lg" asChild>
                            <Link to="/products">
                                Explorar Productos
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                            <Link to="/register-producer">
                                Soy Productor
                            </Link>
                        </Button>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                        <div>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground pt-1">Compromiso con la calidad local</p>
                        </div>
                    </div>
                </div>
                <div className="relative order-1 lg:order-2">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl blur-3xl opacity-20" />
                    <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl">
                        <Carousel
                            opts={{
                                align: "start",
                                loop: true,
                            }}
                            plugins={[plugin.current]}
                            className="w-full"
                        >
                            <CarouselContent>
                                {farmImages.map((image, index) => (
                                    <CarouselItem key={index}>
                                        <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                                            <img
                                                src={image.url}
                                                alt={image.alt}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-2" />
                            <CarouselNext className="right-2" />
                        </Carousel>
                        <div className="absolute -bottom-2 -left-2 sm:-bottom-6 sm:-left-6 bg-white dark:bg-gray-800 rounded-2xl p-3 sm:p-4 shadow-xl">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <MapPin className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
                                <div>
                                    <p className="font-bold text-xl sm:text-2xl">Popayán</p>
                                    <p className="text-xs sm:text-sm text-muted-foreground">Ciudad Blanca</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}