import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/hooks/auth/authProvider"
import HomePage from "@/pages/home/HomePage"
import LoginPage from "@/pages/auth/LoginPage"
import NotFound from "@/pages/NotFound"
import DashBoardProductsList from '@/pages/dashboard/DashBoardProductsList'
import DashBoardPage from '@/pages/dashboard/DashBoardPage'
import ProductsPage from '@/pages/products/ProductsPage'
import CreateProduct from '@/pages/products/CreateProduct'
import CreateGremio from '@/pages/gremios/CreateGremio'
import { RequireAuth } from "./components/auth/RequireAuth"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <AuthProvider>
          <Routes>
            {/* Páginas sin sidebar */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Páginas con sidebar (públicas) */}
            <Route path="/productos" element={<ProductsPage />} />

            {/* Rutas protegidas con sidebar */}
            <Route path="/dashboard/*" element={<RequireAuth />}>
              <Route path="*" element={<DashBoardPage />} />
              <Route path="crear-producto" element={<CreateProduct />} />
              <Route path="crear-gremio" element={<CreateGremio />} />
            </Route>

            <Route path="/dashboard/productos" element={<DashBoardProductsList />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App