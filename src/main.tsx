import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import { AuthProvider } from "./context/AuthContext"
import { ThemeProvider } from "./context/ThemeContext"
import { Toaster } from "@/components/ui/sonner"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="team-lens-theme">
        <AuthProvider>
          <App />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)