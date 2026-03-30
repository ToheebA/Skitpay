import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const handleLogout = () => {
        logout()
        navigate('/')
    }
    return (
        <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">    
            <Link to="/" className="text-2xl font-bold text-purple-600">
                SkitPay
            </Link>

            <div className="flex gap-6">
                <Link 
                    to="/browse"
                    className="text-gray-600 hover:text-purple-600 transition-colors duration-200 font-medium"
                >
                    Browse
                </Link>
                <Link 
                    to="/creators"
                    className="text-gray-600 hover:text-purple-600 transition-colors duration-200 font-medium"
                >
                    Creators
                </Link>
            </div>
            <div className="flex gap-3 items-center">
                {user ? ( 
                    <>  
                        <span className="text-gray-600 font-medium">
                            Hi, {user.name}!
                        </span>                  
                        <Link 
                            to={`/${user.role}/dashboard`}
                            className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
                        >
                            Dashboard
                        </Link>
                        <button 
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 cursor-pointer"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link 
                            to="/login" 
                            className="text-purple-600 border border-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors duration-200 font-medium"
                        >
                            Login
                        </Link>
                        <Link 
                            to="/register" 
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
                        >
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar