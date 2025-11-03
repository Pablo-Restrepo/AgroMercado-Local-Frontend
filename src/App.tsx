import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/hooks/auth/authProvider"
import HomePage from "@/pages/home/HomePage"
import LoginPage from "@/pages/auth/LoginPage"
import NotFound from "@/pages/NotFound"
import DashBoardProductsList from '@/pages/dashboard/DashBoardProductsList'
import DashBoardPage from '@/pages/dashboard/DashBoardPage'
import { RequireAuth } from "./components/auth/RequireAuth"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Rutas protegidas */}
            <Route path="/dashboard/*" element={<RequireAuth />}>
              <Route path="*" element={<DashBoardPage />} />
            </Route>

            <Route path="/productos" element={<DashBoardProductsList />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App