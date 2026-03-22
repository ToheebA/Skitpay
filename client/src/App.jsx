import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Register from './pages/Register'
import Login from './pages/Login'
import BrowseSkits from './pages/BrowseSkits'
import SingleSkit from './pages/SingleSkit'
import Creators from './pages/Creators'
import CreatorProfile from './pages/CreatorProfile'
import CreatorDashboard from './pages/CreatorDashboard'
import FanDashboard from './pages/FanDashboard'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/browse" element={<BrowseSkits />} />
        <Route path="/skits/:id" element={<SingleSkit />} />
        <Route path="/creators" element={<Creators />} />
        <Route path="/creators/:id" element={<CreatorProfile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/creator/dashboard" element={<CreatorDashboard />} />
        <Route path="/fan/dashboard" element={<FanDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App