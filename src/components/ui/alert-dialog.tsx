import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface AlertDialogProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    children: React.ReactNode
}

const AlertDialogContext = React.createContext<{
    onOpenChange?: (open: boolean) => void
}>({})

export function AlertDialog({ open, onOpenChange, children }: AlertDialogProps) {
    if (!open) return null

    return (
        <AlertDialogContext.Provider value={{ onOpenChange }}>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div
                    className="fixed inset-0 bg-black/80 animate-in fade-in-0"
                    onClick={() => onOpenChange?.(false)}
                />
                <div className="relative z-50">
                    {children}
                </div>
            </div>
        </AlertDialogContext.Provider>
    )
}

export function AlertDialogContent({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg animate-in fade-in-0 zoom-in-95",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

export function AlertDialogHeader({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "flex flex-col space-y-2 text-center sm:text-left",
                className
            )}
            {...props}
        />
    )
}

export function AlertDialogFooter({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
                className
            )}
            {...props}
        />
    )
}

export function AlertDialogTitle({
    className,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h2
            className={cn("text-lg font-semibold", className)}
            {...props}
        />
    )
}

export function AlertDialogDescription({
    className,
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p
            className={cn("text-sm text-muted-foreground", className)}
            {...props}
        />
    )
}

export function AlertDialogAction({
    className,
    onClick,
    children,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <Button
            className={className}
            onClick={onClick}
            {...props}
        >
            {children}
        </Button>
    )
}

export function AlertDialogCancel({
    className,
    onClick,
    children,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const { onOpenChange } = React.useContext(AlertDialogContext)

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        onOpenChange?.(false)
        onClick?.(e)
    }

    return (
        <Button
            variant="outline"
            className={cn("mt-2 sm:mt-0", className)}
            onClick={handleClick}
            {...props}
        >
            {children}
        </Button>
    )
}

export const AlertDialogTrigger = ({ children }: { children: React.ReactNode }) => children
export const AlertDialogPortal = ({ children }: { children: React.ReactNode }) => children
export const AlertDialogOverlay = ({ children }: { children: React.ReactNode }) => children
