import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { loginUser } from '../api/auth'
import { jwtDecode } from 'jwt-decode'

const Login = () => {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const response = await loginUser(formData)
            const { token } = response.data 
            login(token)
            const decodedUser = jwtDecode(token)
            if (decodedUser.role === 'creator') navigate('/creator/dashboard')
            if (decodedUser.role === 'fan') navigate('/fan/dashboard')
            if (decodedUser.role === 'brand') navigate('/brand/dashboard')
        } catch (error) {
            setError(error.response?.data?.msg || 'Login failed')
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className="min-h-screen flex flex-col gap-4 items-center justify-center">
            <form onSubmit = {handleSubmit} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-4">
                <h1 className="text-3xl font-bold text-purple-600 text-center mb-2">
                SkitPay
                </h1>
                <h2 className="text-gray-500 text-center mb-6">
                    Welcome back!
                </h2>
                <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-medium">Email</label>
                    <input
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2" 
                        type="email" 
                        placeholder="Email" 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, 
                            email: e.target.value})} />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-medium">Password</label>
                    <input 
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2"
                        type="password" 
                        placeholder="Password" 
                        value={formData.password} 
                        onChange={(e) => setFormData({...formData, 
                            password: e.target.value})} />
                </div>
                <button
                    className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 cursor-pointer transition-colors duration-200"
                    type="submit"
                    disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                </button>
                {error && <p className="text-red-500">{error}</p>}
            </form>
            <p className="text-center text-gray-500 mt-4">
                Don't have an account?
                <Link to="/register" className="text-purple-600 font-semibold"> Register</Link>
            </p>
        </div>
    )
}
export default Login