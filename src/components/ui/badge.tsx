import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border border-red-400 bg-red-100 text-red-500 shadow hover:bg-destructive/20",
        outline:
          "text-foreground",
        success:
          "border border-green-400 bg-success text-green-600 shadow hover:bg-success/80",
        pending:
          "border border-orange-500 bg-orange-100 text-orange-700 shadow hover:bg-orange-50",
        info:
          "border border-blue-400 bg-blue-100 text-blue-700 shadow hover:bg-blue-50",
        warning:
          "border border-yellow-400 bg-yellow-100 text-yellow-700 shadow hover:bg-yellow-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
