import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { MainLayout } from './components/layout/MainLayout'
import { ToastProvider } from './components/ui/Toast'
import { Toaster } from 'sonner'
import AppSettings from './pages/AppSettings'
import Roles from './pages/Roles'
import Grades from './pages/Grades'
import Classes from './pages/Classes'
import Students from './pages/Students'
import Teachers from './pages/Teachers'
import Parents from './pages/Parents'
import Clinistinction from './pages/Clinistinction'
import CountryCode from './pages/CountryCode'
import Schools from './pages/Schools'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <ToastProvider>
        <Routes>
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/" element={<MainLayout><AppSettings /></MainLayout>} />
          <Route path="/roles" element={<MainLayout><Roles /></MainLayout>} />
          <Route path="/grades" element={<MainLayout><Grades /></MainLayout>} />
          <Route path="/classes" element={<MainLayout><Classes /></MainLayout>} />
          <Route path="/students" element={<MainLayout><Students /></MainLayout>} />
          <Route path="/teachers" element={<MainLayout><Teachers /></MainLayout>} />
          <Route path="/parents" element={<MainLayout><Parents /></MainLayout>} />
          <Route path="/clinistinction" element={<MainLayout><Clinistinction /></MainLayout>} />
          <Route path="/country-codes" element={<MainLayout><CountryCode /></MainLayout>} />
          <Route path="/schools" element={<MainLayout><Schools /></MainLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App

