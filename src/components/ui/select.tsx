import { Filter } from "lucide-react"

export type Option = { value: string; label: string }

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  options: Option[]
  className?: string
  placeholder?: string
}

export default function Select({
  value,
  onValueChange,
  options = [],
  className = "" }: SelectProps) {
  return (
    <div className={className}>
      <div className="relative">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none" />
        <select
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          className="appearance-none w-full pl-10 pr-8 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-background text-foreground">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">▾</div>
      </div>
    </div>
  )
}