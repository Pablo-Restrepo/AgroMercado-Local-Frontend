import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from "@/pages/home/HomePage"
import LoginPage from "@/pages/auth/LoginPage"
import NotFound from "@/pages/NotFound"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/hooks/auth/useAuth"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App