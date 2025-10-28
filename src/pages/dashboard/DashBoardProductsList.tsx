import { AppSidebar } from "@/components/dashboard/app-sidebar-product"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { ProductCard, type Product } from "@/components/products/ProductCard"
import { useState } from "react"
import { type FilterState } from "@/components/products/ProductFilters"

const mockProducts: Product[] = [

    {
        "id": "1",
        "name": "Zanahorias",
        "price": 7000,
        "unit": "kg",
        "location": "Finca Los Robles • Popayán",
        "rating": 4.5,
        "reviews": 30,
        "category": "verduras",
        "image": "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "stock": "disponible"
    },
    {
        "id": "2",
        "name": "Lechuga fresca",
        "price": 4000,
        "unit": "kg",
        "location": "Finca Los Robles • Popayán",
        "rating": 4.2,
        "reviews": 18,
        "category": "verduras",
        "image": "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "stock": "disponible"
    },
    {
        "id": "3",
        "name": "Tomates orgánicos",
        "price": 5000,
        "unit": "kg",
        "location": "Finca Los Robles • Popayán",
        "rating": 4.7,
        "reviews": 28,
        "category": "verduras",
        "image": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "stock": "disponible"
    },
    {
        "id": "4",
        "name": "Papas criollas",
        "price": 6000,
        "unit": "kg",
        "location": "Finca El Descanso • Popayán",
        "rating": 4.6,
        "reviews": 45,
        "category": "verduras",
        "image": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "stock": "disponible"
    },
    {
        "id": "5",
        "name": "Aguacate hass",
        "price": 12000,
        "unit": "kg",
        "location": "Finca San José • Popayán",
        "rating": 4.8,
        "reviews": 52,
        "category": "frutas",
        "image": "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "stock": "disponible"
    },
    {
        "id": "6",
        "name": "Fresas frescas",
        "price": 15000,
        "unit": "kg",
        "location": "Finca La Esperanza • Popayán",
        "rating": 4.9,
        "reviews": 67,
        "category": "frutas",
        "image": "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "stock": "disponible"
    },
    {
        "id": "7",
        "name": "Plátano verde",
        "price": 4500,
        "unit": "kg",
        "location": "Finca Los Robles • Popayán",
        "rating": 4.3,
        "reviews": 22,
        "category": "frutas",
        "image": "https://images.unsplash.com/photo-1603833665858-e61d17a86224?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "stock": "disponible"
    },
    {
        "id": "8",
        "name": "Cilantro fresco",
        "price": 2000,
        "unit": "manojo",
        "location": "Finca El Paraíso • Popayán",
        "rating": 4.4,
        "reviews": 15,
        "category": "hierbas",
        "image": "https://images.unsplash.com/photo-1607305387299-a3d9611cd469?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "stock": "disponible"
    },
    {
        "id": "9",
        "name": "Mango tommy",
        "price": 8000,
        "unit": "kg",
        "location": "Finca San José • Popayán",
        "rating": 4.7,
        "reviews": 38,
        "category": "frutas",
        "image": "https://images.unsplash.com/photo-1553279768-865429fa0078?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "stock": "disponible"
    },
    {
        "id": "10",
        "name": "Pimentón",
        "price": 9000,
        "unit": "kg",
        "location": "Finca Los Robles • Popayán",
        "rating": 4.5,
        "reviews": 25,
        "category": "verduras",
        "image": "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "stock": "disponible"
    },
    {
        "id": "11",
        "name": "Limón tahití",
        "price": 5500,
        "unit": "kg",
        "location": "Finca La Esperanza • Popayán",
        "rating": 4.6,
        "reviews": 33,
        "category": "frutas",
        "image": "https://images.unsplash.com/photo-1590502593747-42a996133562?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "stock": "disponible"
    },
    {
        "id": "12",
        "name": "Brócoli",
        "price": 10000,
        "unit": "kg",
        "location": "Finca El Descanso • Popayán",
        "rating": 4.4,
        "reviews": 19,
        "category": "verduras",
        "image": "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "stock": "disponible"
    },
    {
        "id": "13",
        "name": "Naranja valencia",
        "price": 6500,
        "unit": "kg",
        "location": "Finca San José • Popayán",
        "rating": 4.5,
        "reviews": 41,
        "category": "frutas",
        "image": "https://images.unsplash.com/photo-1547514701-42782101795e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "stock": "disponible"
    },
    {
        "id": "14",
        "name": "Cebolla cabezona",
        "price": 5000,
        "unit": "kg",
        "location": "Finca El Paraíso • Popayán",
        "rating": 4.3,
        "reviews": 27,
        "category": "verduras",
        "image": "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "stock": "disponible"
    },
    {
        "id": "15",
        "name": "Espinaca fresca",
        "price": 7500,
        "unit": "kg",
        "location": "Finca Los Robles • Popayán",
        "rating": 4.6,
        "reviews": 24,
        "category": "verduras",
        "image": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "stock": "disponible"
    }
]

export default function DashBoardProductsList() {
    const [filters, setFilters] = useState<FilterState>({
        category: "todo",
        priceRange: [0]
    })

    const filteredProducts = mockProducts.filter(product => {
        const categoryMatch = filters.category === "todo" || product.category === filters.category
        const priceMatch = filters.priceRange[0] === 0 || product.price <= filters.priceRange[0]
        return categoryMatch && priceMatch
    })

    return (
        <SidebarProvider>
            <AppSidebar onFilterChange={setFilters} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <h1 className="text-xl font-semibold">Productos</h1>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                    <div className="grid auto-rows-fr grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mx-auto w-full max-w-7xl place-items-center">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    {filteredProducts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <p className="text-muted-foreground">No se encontraron productos</p>
                        </div>
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
