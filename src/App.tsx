import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { MainLayout } from './components/layout/MainLayout'
import { ToastProvider } from './components/ui/Toast'
import AppSettings from './pages/AppSettings'
import Roles from './pages/Roles'
import Students from './pages/Students'
import Teachers from './pages/Teachers'
import Parents from './pages/Parents'
import Clinistinction from './pages/Clinistinction'
import CountryCode from './pages/CountryCode'
import Schools from './pages/Schools'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<AppSettings />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/students" element={<Students />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/parents" element={<Parents />} />
            <Route path="/clinistinction" element={<Clinistinction />} />
            <Route path="/country-codes" element={<CountryCode />} />
            <Route path="/schools" element={<Schools />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App

