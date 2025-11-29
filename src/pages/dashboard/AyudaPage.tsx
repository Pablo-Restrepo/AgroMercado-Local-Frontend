import React from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AyudaPage() {
  return (
    <DashboardLayout title="Ayuda">
      <div className="container mx-auto px-4 py-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Ayuda & Soporte</h2>
          <p className="text-sm text-gray-600 mb-4">
            Aquí puedes colocar preguntas frecuentes, contacto o guías rápidas.
          </p>
          <div className="space-y-3">
            <p className="text-sm">• ¿Cómo comprar?</p>
            <p className="text-sm">• ¿Cómo crear un producto?</p>
            <p className="text-sm">• Contacto: soporte@tudominio.com</p>
          </div>
          <div className="mt-4">
            <Button>Enviar consulta</Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}