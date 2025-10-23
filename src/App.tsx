import './App.css'
import ComponentTestPage from "@/pages/component-test";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen">
        <main className="p-6">
          <ComponentTestPage />
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
