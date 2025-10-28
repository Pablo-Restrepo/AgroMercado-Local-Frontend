import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"

interface ProductFiltersProps {
    onFilterChange?: (filters: FilterState) => void
}

export interface FilterState {
    category: string
    priceRange: number[]
}

export function ProductFilters({ onFilterChange }: ProductFiltersProps) {
    const [category, setCategory] = useState("todo")
    const [priceRange, setPriceRange] = useState([0])

    const categories = [
        { id: "todo", label: "Todo" },
        { id: "frutas", label: "Frutas" },
        { id: "verduras", label: "Verduras" },
        { id: "medicinales", label: "Medicinales" },
        { id: "tuberculos", label: "Tubérculos" },
        { id: "hierbas", label: "Hierbas" },
    ]

    const handleCategoryChange = (value: string) => {
        setCategory(value)
        onFilterChange?.({ category: value, priceRange })
    }

    const handlePriceChange = (value: number[]) => {
        setPriceRange(value)
        onFilterChange?.({ category, priceRange: value })
    }

    return (
        <div className="space-y-6">
            {/* Categoría */}
            <div className="space-y-3">
                <h3 className="font-semibold text-sm">Categoría</h3>
                <RadioGroup value={category} onValueChange={handleCategoryChange}>
                    {categories.map((cat) => (
                        <div key={cat.id} className="flex items-center space-x-2">
                            <RadioGroupItem value={cat.id} id={cat.id} />
                            <Label htmlFor={cat.id} className="text-sm font-normal cursor-pointer">
                                {cat.label}
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            {/* Rango de Precio */}
            <div className="space-y-3">
                <h3 className="font-semibold text-sm">Rango de Precio</h3>
                <div className="space-y-2">
                    <Slider
                        value={priceRange}
                        onValueChange={handlePriceChange}
                        max={50000}
                        step={1000}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>$0</span>
                        <span>${priceRange[0].toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
