import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
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
        <div>
            <form onSubmit = {handleSubmit}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, 
                        email: e.target.value})} />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={formData.password} 
                    onChange={(e) => setFormData({...formData, 
                        password: e.target.value})} />
                <button 
                    type="submit"
                    disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                </button>
                {error && <p className="text-red-500">{error}</p>}
            </form>
        </div>
    )
}
export default Login