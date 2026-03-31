import { reactivateProfile } from '../api/creator'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ReactivateProfile = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleReactivate = async () => {
        setIsLoading(true)
        try {
            await reactivateProfile()
            navigate('/creator/dashboard')
        } catch (error) {
            setError(error.response?.data?.msg || 'Failed to reactivate profile')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                <h1 className="text-3xl font-bold text-purple-600 mb-2">
                    SkitPay
                </h1>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Reactivate Your Profile
                </h2>
                <p className="text-gray-500 mb-8">
                    Your profile is currently deactivated. 
                    Reactivate to start creating and earning again!
                </p>
                <button
                    onClick={handleReactivate}
                    disabled={isLoading}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 cursor-pointer transition-colors duration-200 font-medium"
                >
                    {isLoading ? 'Reactivating...' : 'Reactivate Profile'}
                </button>
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
        </div>
    )
}

export default ReactivateProfile