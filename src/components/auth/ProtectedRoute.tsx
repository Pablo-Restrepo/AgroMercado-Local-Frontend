import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: ('admin' | 'productor' | 'cliente' | 'productor-admin')[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.u_rol)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
