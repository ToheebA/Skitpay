import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Register from './pages/Register'
import Login from './pages/Login'
import BrowseSkits from './pages/BrowseSkits'
import SingleSkit from './pages/SingleSkit'
import Creators from './pages/Creators'
import CreateProfile from './pages/CreateProfile'
import CreatorProfile from './pages/CreatorProfile'
import CreatorDashboard from './pages/CreatorDashboard'
import FanDashboard from './pages/FanDashboard'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import UploadSkit from './pages/UploadSkit'
import EditProfile from './pages/EditProfile'
import ManageSkits from './pages/ManageSkits'
import EditSkit from './pages/EditSkit'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/browse" element={<BrowseSkits />} />
        <Route path="/skits/:id" element={<SingleSkit />} />
        <Route path="/creators" element={<Creators />} />
        <Route path="/creators/:id" element={<CreatorProfile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/creator/profile/create" element={
          <ProtectedRoute allowedRoles={['creator']}>
              <CreateProfile />
          </ProtectedRoute>
      } />
        <Route path="/creator/dashboard" element={
          <ProtectedRoute allowedRoles={['creator']}>  
            <CreatorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/creator/upload" element={
          <ProtectedRoute allowedRoles={['creator']}>  
            <UploadSkit />
          </ProtectedRoute>
        } />
        <Route path="/creator/profile/edit" element={
          <ProtectedRoute allowedRoles={['creator']}>  
            <EditProfile />
          </ProtectedRoute>
        } />
        <Route path="/creator/skits" element={
          <ProtectedRoute allowedRoles={['creator']}>  
            <ManageSkits />
          </ProtectedRoute>
        } />
        <Route path="/creator/skits/:id/edit" element={
          <ProtectedRoute allowedRoles={['creator']}>  
            <EditSkit />
          </ProtectedRoute>
        } />
        <Route path="/fan/dashboard" element={
          <ProtectedRoute allowedRoles={['fan', 'brand']}>
            <FanDashboard />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App