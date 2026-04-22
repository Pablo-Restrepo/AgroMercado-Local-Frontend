import { useAuth } from '@/hooks/auth/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface UserMenuProps {
    isMobile?: boolean;
}

export function UserMenu({ isMobile = false }: UserMenuProps) {
    const { user, logout, isAuthenticated } = useAuth();

    if (!isAuthenticated || !user) {
        return null;
    }

    const getInitials = (name: string | undefined) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getRoleBadge = (rol: string) => {
        const badges = {
            admin: { label: 'Admin', variant: 'destructive' as const },
            productor: { label: 'Productor', variant: 'default' as const },
            cliente: { label: 'Cliente', variant: 'secondary' as const },
        };

        return badges[rol as keyof typeof badges] || badges.cliente;
    };

    const roleBadge = getRoleBadge(user.u_rol);

    if (isMobile) {
        return (
            <Button
                variant="destructive"
                className="w-full h-10 font-semibold"
                onClick={logout}
            >
                Cerrar Sesión
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                        <AvatarFallback>{getInitials(user.u_nombre_usuario)}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.u_nombre_usuario}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.u_email}</p>
                        <div className="pt-1">
                            <Badge variant={roleBadge.variant}>{roleBadge.label}</Badge>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Perfil</DropdownMenuItem>
                <DropdownMenuItem>Configuración</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600">
                    Cerrar sesión
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
