import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { registerUser } from '../api/auth'
import { jwtDecode } from 'jwt-decode'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])[A-Za-z\d\W]{8,}$/

const Register = () => {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'fan',
        location: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (!formData.name || !formData.email || !formData.password || !formData.location) {
            setError('Please fill in all fields')
            return
        }
        if (!emailRegex.test(formData.email)) {
            setError('Please provide a valid email address')
            return
        }
        if (!passwordRegex.test(formData.password)) {
            setError('Password must be at least 8 characters and include uppercase, lowercase, number and special character')
            return
        }
        setIsLoading(true)
        try {
            const response = await registerUser(formData)
            const { token } = response.data
            login(token)
            const decodedUser = jwtDecode(token)
            if (decodedUser.role === 'creator') navigate('/creator/dashboard')
            if (decodedUser.role === 'fan') navigate('/fan/dashboard')
            if (decodedUser.role === 'brand') navigate('/brand/dashboard')
        } catch (error) {
            setError(error.response?.data?.msg || 'Registration failed')
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
                    Create your account
                </h2>
                <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-medium">Name</label>
                    <input 
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2" 
                        type="text" 
                        placeholder="Name" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, 
                            name: e.target.value})} 
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-medium">Email</label>
                    <input 
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2" 
                        type="text" 
                        placeholder="Email" 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, 
                            email: e.target.value})} 
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-medium">Password</label>
                    <div className="relative">
                        <input 
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2" 
                            type={showPassword ? 'text' : 'password'} 
                            placeholder="Password" 
                            value={formData.password} 
                            onChange={(e) => setFormData({...formData, 
                                password: e.target.value})} 
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>
                    <p className="text-xs text-gray-400">
                        Min 8 characters with uppercase, lowercase, number and special character (@$!%*?&)
                    </p>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-medium">Role</label>
                    <select
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2" 
                        value={formData.role} 
                        onChange={(e) => setFormData({...formData, 
                            role: e.target.value})} 
                    >
                        <option value="creator">Creator</option>
                        <option value="fan">Fan</option>
                        <option value="brand">Brand</option>
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-medium">Location</label>
                    <input 
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2" 
                        type="text" 
                        placeholder="Location" 
                        value={formData.location} 
                        onChange={(e) => setFormData({...formData, 
                            location: e.target.value})} 
                    />
                </div>
                <button
                    className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 cursor-pointer transition-colors duration-200"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? 'Registering...' : 'Register'}
                </button>
                {error && <p className="text-red-500">{error}</p>}
            </form>
            <p className="text-center text-gray-500 mt-4">
                Already have an account?
                <Link to="/login" className="text-purple-600 font-semibold"> Login</Link>
            </p>
        </div>
    )
}
export default Register