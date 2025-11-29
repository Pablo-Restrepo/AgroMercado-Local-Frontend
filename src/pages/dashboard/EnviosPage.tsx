import React from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import EnviosList from "@/components/envios/EnviosList"

export default function EnviosPage() {
  return (
    <DashboardLayout title="Mis envíos">
      <div className="container mx-auto px-4 py-6">
        <EnviosList />
      </div>
    </DashboardLayout>
  )
}