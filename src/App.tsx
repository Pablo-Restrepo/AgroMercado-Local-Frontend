import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/hooks/auth/authProvider"
import HomePage from "@/pages/home/HomePage"
import LoginPage from "@/pages/auth/LoginPage"
import NotFound from "@/pages/NotFound"
import DashBoardProductsList from '@/pages/dashboard/DashBoardProductsList'
import DashBoardShoppingPage from '@/pages/dashboard/DashBoardShoppingPage'
import ProductsPage from '@/pages/products/ProductsPage'
import CreateProduct from '@/pages/products/CreateProduct'
import CreateProducer from '@/pages/dashboard/CreateProducer'
import CreateGremio from '@/pages/gremios/CreateGremio'
import ProducerManagement from '@/pages/dashboard/ProducerManagement'
import EnviosPage from '@/pages/dashboard/EnviosPage'
import { RequireAuth } from "./components/auth/RequireAuth"
import RegisterPage from '@/pages/auth/RegisterPage'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <AuthProvider>
          <Routes>
            {/* Páginas sin sidebar */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />

            {/* Páginas públicas con sidebar */}

            {/* Páginas con sidebar (públicas) */}
            <Route path="/productos" element={<ProductsPage />} />

            {/* Rutas protegidas con sidebar de dashboard */}
            <Route path="/dashboard/*" element={<RequireAuth />}>
              <Route path="" element={<DashBoardShoppingPage />} />
              <Route path="mis-productos" element={<DashBoardProductsList />} />
              <Route path="crear-producto" element={<CreateProduct />} />
              <Route path="crear-productor" element={<CreateProducer />} />
              <Route path="crear-gremio" element={<CreateGremio />} />
              <Route path="mi-gremio" element={<ProducerManagement />} />
              <Route path="envios" element={<EnviosPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App