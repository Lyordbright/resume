import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Toaster } from "sonner"
import Home from "./pages/Home"
import SignupPage from "./pages/Signup"
import LoginPage from "./pages/Login"
import AuthProvider from "./contexts/AuthContexts"
import ProtectedRoute from "./components/Protectedroutes"
import VerifyEmailPage from "./pages/VerifyEmailPage"
import DashboardLayout from "./pages/Dashboard"
import DashboardOverview from "./pages/DashboardOverview"
import ResumesPage from "./pages/ResumesPage"
import ResumeEditor from "./pages/ResumeEditor"
import AccountPage from "./pages/AccountPage"
import GeneratePage from "./pages/GeneratePage"
import TemplatesPage from "./pages/TemplatesPage"



const App = () => {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Toaster
            closeButton
            position="top-right"
            richColors
            theme="dark"
            duration={4000}
            visibleToasts={1}
            offset="70px"
            expand
            toastOptions={{
              style: { fontSize: "14px", borderRadius: "10px" },
              className: "custom-toast",
            }}
          />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/verify-email/:token" element={<VerifyEmailPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardOverview />} />
                <Route path="resumes/:id" element={<ResumeEditor />} />
                <Route path="account" element={<AccountPage />} />
                {/* Uncomment as you build each page */}
                <Route path="resumes" element={<ResumesPage />} />
                <Route path="generate" element={<GeneratePage />} />
                <Route path="templates" element={<TemplatesPage />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
