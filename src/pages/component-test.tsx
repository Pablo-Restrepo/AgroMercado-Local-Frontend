import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/mode-toggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, User, Mail, Phone, MapPin, Calendar, Plus, ArrowRight, AlertCircle, Bell, Search, Settings, Home, FileText, BarChart, Download, Upload, Trash2, Edit, Eye, EyeOff, Heart, Star, Share2, MessageCircle, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

export default function ComponentTestPage() {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newErrors: Record<string, string> = {};

        const email = formData.get('email-input') as string;
        if (!email || email.trim() === '') {
            newErrors['email-input'] = 'Este valor es requerido';
        }

        const password = formData.get('password-input') as string;
        if (!password || password.trim() === '') {
            newErrors['password-input'] = 'Este valor es requerido';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            alert('Formulario enviado!');
        }
    };

    const handleInputChange = (fieldName: string) => {
        if (errors[fieldName]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
        }
    };
    return (
        <div className="container mx-auto p-1">
            <header className="flex items-center justify-between mb-6 md:mb-8">
                <h1 className="text-3xl font-bold">Componentes de Prueba</h1>
                <div>
                    <ModeToggle />
                </div>
            </header>
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8">
                {/* Buttons */}
                <Card className="w-full max-w-[350px] break-inside-avoid">
                    <CardHeader>
                        <CardTitle>Botones</CardTitle>
                        <CardDescription>Diferentes tamaños y variantes</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Primary Buttons */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-muted-foreground">Primary</h3>
                            <div className="flex flex-wrap gap-2 items-center">
                                <Button size="sm">Pequeño</Button>
                                <Button size="default">Por Defecto</Button>
                                <Button size="lg">Grande</Button>
                                <Button size="icon">🔍</Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button size="sm">
                                    <Plus />Botón<Plus />
                                </Button>
                                <Button size="default">
                                    <Plus />Botón<Plus />
                                </Button>
                                <Button size="lg">
                                    <Plus />Botón<Plus />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button size="icon" className="h-8 w-8">
                                    <Loader2 className="animate-spin" />
                                </Button>
                                <Button size="icon" className="h-10 w-10">
                                    <Loader2 className="animate-spin" />
                                </Button>
                                <Button size="icon" className="h-12 w-12">
                                    <Loader2 className="animate-spin" />
                                </Button>
                            </div>
                        </div>

                        {/* Secondary Buttons */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-muted-foreground">Secondary</h3>
                            <div className="flex flex-wrap gap-2 items-center">
                                <Button size="sm" variant="secondary">Pequeño</Button>
                                <Button size="default" variant="secondary">Por Defecto</Button>
                                <Button size="lg" variant="secondary">Grande</Button>
                                <Button size="icon" variant="secondary">🔍</Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button size="sm" variant="secondary">
                                    <Plus />Botón<Plus />
                                </Button>
                                <Button size="default" variant="secondary">
                                    <Plus />Botón<Plus />
                                </Button>
                                <Button size="lg" variant="secondary">
                                    <Plus />Botón<Plus />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button size="icon" variant="secondary" className="h-8 w-8">
                                    <Loader2 className="animate-spin" />
                                </Button>
                                <Button size="icon" variant="secondary" className="h-10 w-10">
                                    <Loader2 className="animate-spin" />
                                </Button>
                                <Button size="icon" variant="secondary" className="h-12 w-12">
                                    <Loader2 className="animate-spin" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Spinners */}
                <Card className="w-full max-w-[350px] break-inside-avoid">
                    <CardHeader>
                        <CardTitle>Spinners</CardTitle>
                        <CardDescription>Diferentes tamaños y colores</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-4 items-center">
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        </div>
                        <div className="flex flex-wrap gap-4 items-center bg-black p-3 rounded-lg">
                            <Loader2 className="h-6 w-6 animate-spin text-white" />
                            <Loader2 className="h-8 w-8 animate-spin text-white" />
                            <Loader2 className="h-10 w-10 animate-spin text-white" />
                        </div>
                        <div className="flex flex-wrap gap-4 items-center">
                            <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
                            <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                            <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
                        </div>
                        <div className="flex flex-wrap gap-4 items-center p-3 rounded-lg">
                            <Loader2 className="h-6 w-6 animate-spin text-black" />
                            <Loader2 className="h-8 w-8 animate-spin text-black" />
                            <Loader2 className="h-10 w-10 animate-spin text-black" />
                        </div>
                        <Button disabled>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Cargando...
                        </Button>
                    </CardContent>
                </Card>


                {/* Badges */}
                <Card className="w-full max-w-[350px] break-inside-avoid">
                    <CardHeader>
                        <CardTitle>Badges</CardTitle>
                        <CardDescription>Diferentes variantes y estilos</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        <Badge>Default</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="destructive">Destructive</Badge>
                        <Badge variant="outline">Outline</Badge>
                        <Badge variant="success">Éxito</Badge>
                        <Badge variant="pending">Pendiente</Badge>
                        <Badge variant="info">Info</Badge>
                        <Badge variant="warning">Advertencia</Badge>
                    </CardContent>
                </Card>

                {/* Checkboxes */}
                <Card className="w-full max-w-[350px] break-inside-avoid">
                    <CardHeader>
                        <CardTitle>Checkboxes</CardTitle>
                        <CardDescription>Diferentes estados y tamaños</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="check1" />
                            <Label htmlFor="check1" className="text-sm font-medium">
                                Checkbox Normal
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="check2" defaultChecked />
                            <Label htmlFor="check2" className="text-sm font-medium">
                                Checkbox Marcado
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="check3" disabled />
                            <Label htmlFor="check3" className="text-sm font-medium text-muted-foreground">
                                Checkbox Deshabilitado
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="check4" disabled defaultChecked />
                            <Label htmlFor="check4" className="text-sm font-medium text-muted-foreground">
                                Checkbox Marcado y Deshabilitado
                            </Label>
                        </div>
                    </CardContent>
                </Card>

                {/* User Profile Card */}
                <Card className="w-full max-w-[350px] break-inside-avoid">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Perfil de Usuario
                        </CardTitle>
                        <CardDescription>Información del usuario activo</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Juan Pérez</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>juan.perez@ejemplo.com</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>+1 234 567 890</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>Madrid, España</span>
                        </div>
                        <div className="pt-2 flex gap-2">
                            <Button size="sm" className="flex-1">Editar</Button>
                            <Button size="sm" variant="secondary" className="flex-1">Ver más</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics Card */}
                <Card className="w-full max-w-[350px] break-inside-avoid">
                    <CardHeader>
                        <CardTitle>Estadísticas</CardTitle>
                        <CardDescription>Resumen del mes actual</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            <li className="flex justify-between items-center">
                                <span className="text-sm font-medium">Total Ventas</span>
                                <Badge variant="success">$12,450</Badge>
                            </li>
                            <li className="flex justify-between items-center">
                                <span className="text-sm font-medium">Clientes Nuevos</span>
                                <Badge variant="info">42</Badge>
                            </li>
                            <li className="flex justify-between items-center">
                                <span className="text-sm font-medium">Productos Vendidos</span>
                                <Badge variant="info">156</Badge>
                            </li>
                            <li className="flex justify-between items-center">
                                <span className="text-sm font-medium">Tasa de Conversión</span>
                                <Badge variant="outline">23.5%</Badge>
                            </li>
                        </ul>
                        <div className="mt-4 pt-4 border-t">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>Actualizado: 18 Oct 2025</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Text Inputs */}
                <Card className="w-full max-w-[350px] break-inside-avoid">
                    <CardHeader>
                        <CardTitle>Campos de Texto</CardTitle>
                        <CardDescription>Diferentes tipos de inputs</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="text-input">Input de Texto</Label>
                                <Input id="text-input" name="text-input" type="text" placeholder="Escribe algo..." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email-input">Email <span className="text-red-500">*</span></Label>
                                <Input
                                    id="email-input"
                                    name="email-input"
                                    type="email"
                                    placeholder="correo@ejemplo.com"
                                    onChange={() => handleInputChange('email-input')}
                                    className={errors['email-input'] ? 'border-destructive' : ''}
                                />
                                {errors['email-input'] && (
                                    <div className="flex items-center gap-2 text-sm text-destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <span>{errors['email-input']}</span>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password-input">Contraseña <span className="text-red-500">*</span></Label>
                                <Input
                                    id="password-input"
                                    name="password-input"
                                    type="password"
                                    placeholder="••••••••"
                                    onChange={() => handleInputChange('password-input')}
                                    className={errors['password-input'] ? 'border-destructive' : ''}
                                />
                                {errors['password-input'] && (
                                    <div className="flex items-center gap-2 text-sm text-destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <span>{errors['password-input']}</span>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="disabled-input">Input Deshabilitado</Label>
                                <Input id="disabled-input" type="text" disabled placeholder="Deshabilitado" />
                            </div>
                            <Button type="submit" className="w-full">
                                <ArrowRight />
                                Enviar
                            </Button>
                        </form>
                    </CardContent>
                </Card>
                {/* Icon Buttons */}
                <Card className="w-full max-w-[350px] break-inside-avoid">
                    <CardHeader>
                        <CardTitle>Botones con Iconos</CardTitle>
                        <CardDescription>Diferentes combinaciones de iconos</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-muted-foreground">Iconos a la izquierda</h3>
                            <div className="flex flex-wrap gap-2">
                                <Button size="sm"><Download />Descargar</Button>
                                <Button size="sm" variant="secondary"><Upload />Subir</Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-muted-foreground">Iconos a la derecha</h3>
                            <div className="flex flex-wrap gap-2">
                                <Button size="sm">Siguiente<ArrowRight /></Button>
                                <Button size="sm" variant="secondary">Buscar<Search /></Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-muted-foreground">Solo iconos</h3>
                            <div className="flex flex-wrap gap-2">
                                <Button size="icon"><Bell /></Button>
                                <Button size="icon" variant="secondary"><Search /></Button>
                                <Button size="icon" variant="destructive"><Trash2 /></Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications Card */}
                <Card className="w-full max-w-[350px] break-inside-avoid">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                Notificaciones
                            </span>
                            <Badge variant="destructive">3</Badge>
                        </CardTitle>
                        <CardDescription>Actividad reciente</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-start gap-3 p-2 hover:bg-muted rounded-lg cursor-pointer">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">Pago procesado</p>
                                <p className="text-xs text-muted-foreground">Hace 5 minutos</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-2 hover:bg-muted rounded-lg cursor-pointer">
                            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">Verificación pendiente</p>
                                <p className="text-xs text-muted-foreground">Hace 15 minutos</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-2 hover:bg-muted rounded-lg cursor-pointer">
                            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">Nueva actualización</p>
                                <p className="text-xs text-muted-foreground">Hace 1 hora</p>
                            </div>
                        </div>
                        <Button className="w-full" size="sm">
                            Ver todas
                        </Button>
                    </CardContent>
                </Card>

                {/* Metrics Card */}
                <Card className="w-full max-w-[350px] break-inside-avoid">
                    <CardHeader>
                        <CardTitle>Métricas Clave</CardTitle>
                        <CardDescription>Rendimiento del sistema</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Tasa de éxito</span>
                                <span className="text-sm font-bold text-green-600 flex items-center gap-1">
                                    <TrendingUp className="h-4 w-4" />
                                    98.5%
                                </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '98.5%' }}></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Tiempo de respuesta</span>
                                <span className="text-sm font-bold text-orange-600 flex items-center gap-1">
                                    <TrendingDown className="h-4 w-4" />
                                    450ms
                                </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Disponibilidad</span>
                                <span className="text-sm font-bold text-blue-600 flex items-center gap-1">
                                    <TrendingUp className="h-4 w-4" />
                                    99.9%
                                </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '99.9%' }}></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions Card */}
                <Card className="w-full max-w-[350px] break-inside-avoid">
                    <CardHeader>
                        <CardTitle>Acciones Rápidas</CardTitle>
                        <CardDescription>Tareas frecuentes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" className="h-20 flex-col gap-2">
                                <FileText className="h-6 w-6" />
                                <span className="text-xs">Nuevo Doc</span>
                            </Button>
                            <Button variant="outline" className="h-20 flex-col gap-2">
                                <Upload className="h-6 w-6" />
                                <span className="text-xs">Subir</span>
                            </Button>
                            <Button variant="outline" className="h-20 flex-col gap-2">
                                <BarChart className="h-6 w-6" />
                                <span className="text-xs">Reportes</span>
                            </Button>
                            <Button variant="outline" className="h-20 flex-col gap-2">
                                <Settings className="h-6 w-6" />
                                <span className="text-xs">Ajustes</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Task List Card */}
                <Card className="w-full max-w-[350px] break-inside-avoid">
                    <CardHeader>
                        <CardTitle>Lista de Tareas</CardTitle>
                        <CardDescription>Pendientes de hoy</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg">
                            <Checkbox id="task1" defaultChecked />
                            <Label htmlFor="task1" className="flex-1 text-sm line-through text-muted-foreground cursor-pointer">
                                Revisar documentación
                            </Label>
                            <Badge variant="success">Completada</Badge>
                        </div>
                        <div className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg">
                            <Checkbox id="task2" />
                            <Label htmlFor="task2" className="flex-1 text-sm cursor-pointer">
                                Llamar a cliente
                            </Label>
                            <Badge variant="destructive">Urgente</Badge>
                        </div>
                        <div className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg">
                            <Checkbox id="task3" />
                            <Label htmlFor="task3" className="flex-1 text-sm cursor-pointer">
                                Actualizar base de datos
                            </Label>
                            <Badge variant="warning">Media</Badge>
                        </div>
                        <div className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg">
                            <Checkbox id="task4" />
                            <Label htmlFor="task4" className="flex-1 text-sm cursor-pointer">
                                Preparar presentación
                            </Label>
                            <Badge variant="outline">Baja</Badge>
                        </div>
                        <Button size="sm" className="w-full mt-2">
                            <Plus />
                            Agregar tarea
                        </Button>
                    </CardContent>
                </Card>

                {/* Alert States */}
                <Card className="w-full max-w-[350px] break-inside-avoid">
                    <CardHeader>
                        <CardTitle>Estados de Alerta</CardTitle>
                        <CardDescription>Mensajes informativos</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-green-900 dark:text-green-100">Éxito</p>
                                <p className="text-xs text-green-700 dark:text-green-300">Operación completada correctamente</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Información</p>
                                <p className="text-xs text-blue-700 dark:text-blue-300">Hay una actualización disponible</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Advertencia</p>
                                <p className="text-xs text-yellow-700 dark:text-yellow-300">Verifica los datos antes de continuar</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                            <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-red-900 dark:text-red-100">Error</p>
                                <p className="text-xs text-red-700 dark:text-red-300">No se pudo completar la operación</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Advanced Inputs */}
                <Card className="w-full max-w-[350px] break-inside-avoid">
                    <CardHeader>
                        <CardTitle>Input Avanzados</CardTitle>
                        <CardDescription>Campos con funcionalidad adicional</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password-toggle">Contraseña con Toggle</Label>
                            <div className="relative">
                                <Input
                                    id="password-toggle"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="search-input">Búsqueda</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="search-input"
                                    type="text"
                                    placeholder="Buscar..."
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="file-input">Subir Archivo</Label>
                            <Input id="file-input" type="file" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="number-input">Número</Label>
                            <Input id="number-input" type="number" placeholder="0" min="0" max="100" />
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity Card */}
                <Card className="w-full max-w-[350px] break-inside-avoid">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Actividad Reciente
                        </CardTitle>
                        <CardDescription>Últimas acciones</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="flex flex-col items-center">
                                    <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center shrink-0">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div className="w-0.5 flex-1 bg-muted mt-2"></div>
                                </div>
                                <div className="flex-1 pb-4">
                                    <p className="text-sm font-medium">Documento aprobado</p>
                                    <p className="text-xs text-muted-foreground">Hace 2 horas</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex flex-col items-center">
                                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                                        <Upload className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div className="w-0.5 flex-1 bg-muted mt-2"></div>
                                </div>
                                <div className="flex-1 pb-4">
                                    <p className="text-sm font-medium">Archivo subido</p>
                                    <p className="text-xs text-muted-foreground">Hace 5 horas</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center shrink-0">
                                    <Edit className="h-4 w-4 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Perfil actualizado</p>
                                    <p className="text-xs text-muted-foreground">Hace 1 día</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Social Interactions Card */}
                <Card className="w-full max-w-[350px] break-inside-avoid">
                    <CardHeader>
                        <CardTitle>Publicación</CardTitle>
                        <CardDescription>Ejemplo de contenido social</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm">
                            ¡Acabamos de lanzar nuestra nueva funcionalidad! 🚀
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t">
                            <Button size="sm">
                                <Heart className="h-4 w-4" />
                                <span>124</span>
                            </Button>
                            <Button size="sm">
                                <MessageCircle className="h-4 w-4" />
                                <span>32</span>
                            </Button>
                            <Button size="sm">
                                <Share2 className="h-4 w-4" />
                                <span>8</span>
                            </Button>
                            <Button size="sm">
                                <Star className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Navigation Card */}
                <Card className="w-full max-w-[350px] break-inside-avoid">
                    <CardHeader>
                        <CardTitle>Menú de Navegación</CardTitle>
                        <CardDescription>Enlaces principales</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button className="w-full justify-start">
                            <Home className="h-4 w-4" />
                            Inicio
                        </Button>
                        <Button className="w-full justify-start">
                            <FileText className="h-4 w-4" />
                            Documentos
                        </Button>
                        <Button className="w-full justify-start">
                            <BarChart className="h-4 w-4" />
                            Estadísticas
                        </Button>
                        <Button className="w-full justify-start">
                            <User className="h-4 w-4" />
                            Perfil
                        </Button>
                        <Button className="w-full justify-start">
                            <Settings className="h-4 w-4" />
                            Configuración
                        </Button>
                    </CardContent>
                </Card>

                {/* Special Badges */}
                <Card className="w-full max-w-[350px] break-inside-avoid">
                    <CardHeader>
                        <CardTitle>Badges con Iconos</CardTitle>
                        <CardDescription>Estados y categorías</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        <Badge variant="success" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Activo
                        </Badge>
                        <Badge variant="pending" className="gap-1">
                            <Clock className="h-3 w-3" />
                            Pendiente
                        </Badge>
                        <Badge variant="destructive" className="gap-1">
                            <XCircle className="h-3 w-3" />
                            Cancelado
                        </Badge>
                        <Badge variant="warning" className="gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            En revisión
                        </Badge>
                        <Badge className="bg-purple-500 hover:bg-purple-600 gap-1">
                            <Star className="h-3 w-3" />
                            Premium
                        </Badge>
                        <Badge variant="info" className="gap-1">
                            <Info className="h-3 w-3" />
                            Nuevo
                        </Badge>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}