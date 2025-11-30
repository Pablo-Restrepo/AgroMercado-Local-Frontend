import React from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ConfiguracionesPage() {
  return (
    <DashboardLayout title="Configuraciones">
      <div className="container mx-auto px-4 py-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Configuraciones</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Esta página es únicamente decorativa. Aquí puede ir la configuración del usuario.
          </p>
          <div className="flex gap-2">
            <Button variant="outline">Editar perfil</Button>
            <Button variant="outline">Preferencias</Button>
            <Button variant="ghost">Notificaciones</Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}