import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import { AuthProvider } from '../context/AuthContext'
import ProtectedRoute from '../components/ProtectedRoute'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import SearchResults from '../pages/SearchResults'
import ServiceDetails from '../pages/ServiceDetails'
import Dashboard from '../pages/Dashboard'
import CreateService from '../pages/CreateService'
import EditService from '../pages/EditService'
import Profile from '../pages/Profile'

function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services" element={<SearchResults />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/services/create" element={<CreateService />} />
            <Route path="/services/edit/:id" element={<EditService />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default AppRoutes
