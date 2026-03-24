import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth()
    if (!user) return <Navigate to="/login" />
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        if (user.role === 'creator') return <Navigate to="/creator/dashboard" />
        if (user.role === 'fan') return <Navigate to="/fan/dashboard" />
    }
    return children
}

export default ProtectedRoute