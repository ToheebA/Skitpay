import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import { getAllSkits, getSubscriptions, cancelSubscription } from '../api/fan'
import { Link, useNavigate } from 'react-router-dom'

const FanDashboard = () => {
    const { user } = useAuth()
    const [subscriptions, setSubscriptions] = useState([])
    const [recentSkits, setRecentSkits] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [isModal, setIsModal] = useState(false)
    const [subscriptionToCancel, setSubscriptionToCancel] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try{
                const [subscriptionRes, skitRes] = await Promise.all([
                    getSubscriptions(),
                    getAllSkits({ sort: '-createdAt', limit: 6 })
                ])
                setSubscriptions(subscriptionRes.data.subscriptions)
                setRecentSkits(skitRes.data.skits)
            } catch (error) {
                setError(error.response?.data?.msg || 'Failed to fetch subscriptions')
            } finally {
                setIsLoading(false)
            }
        }
        fetchSubscriptions()
    }, [])

    const handleDeactivateClick = (subscriptionId) => {
        setSubscriptionToCancel(subscriptionId)
        setIsModal(true)
    } 

    const handleDeactivateConfirm = async () => {
        try {
            await cancelSubscription(subscriptionToCancel)
            setSubscriptions(subscriptions.filter(subscription => subscription._id !== subscriptionToCancel))
            setIsModal(false)
            setSubscriptionToCancel(null)
        } catch (error) {
            setError(error.response?.data?.msg || 'Failed to cancel subscription')
        }
    }

    const handleDeactivateCancel = () => {
        setIsModal(false)
        setSubscriptionToCancel(null)
    }

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>{error}</div>
    if (subscriptions.length === 0) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
            <p className="text-gray-500 text-lg">No subscription yet!</p>
            <Link
                to="/creators"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
            >
                Find creators to subscribe to
            </Link>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Welcome! {user.name}
                </h1>
                <Link
                    to="/creators"
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
                >
                    Subscribe to a new creator
                </Link>
            </div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    My Subscriptions
                </h2>
                <div className="flex flex-wrap gap-6">
                    {subscriptions.map(sub => (
                        <div key={sub._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="p-4">
                                <p className="font-bold text-gray-900 text-xl">{sub.creator.name}</p>
                                <p className="text-gray-900 font-bold text-lg">₦{sub.amount}/month</p>
                                <p className="font-bold text-gray-900">Expires: {new Date(sub.endDate).toLocaleDateString('en-NG', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                                <Link
                                    to={`/creators/${sub.creatorProfileId}`}
                                    className="block mt-3 text-purple-600 hover:text-purple-700 font-medium text-sm"
                                >
                                    View Profile →
                                </Link>
                            </div>
                            <div>
                                <button
                                    onClick={() => handleDeactivateClick(sub._id)}
                                    className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 text-sm"
                                >
                                    Deactivate Subscription
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {isModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 max-w-sm w-full">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Deactivate Subscription?
                        </h2>
                        <div className="flex gap-4">
                            <button
                                onClick={handleDeactivateConfirm}
                                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                            >
                                Deactivate
                            </button>
                            <button
                                onClick={handleDeactivateCancel}
                                className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Recent Skits
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recentSkits.map(skit => (
                        <div key={skit._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <img src={skit.thumbnailUrl} alt={skit.title} className="w-full h-48 object-cover"/>
                            <div className="p-4">
                                <p className="font-bold text-gray-900">{skit.title}</p>
                                <span className={`text-xs px-2 py-1 rounded-full ${skit.visibility === 'free' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                                    {skit.visibility}
                                </span>
                                <Link 
                                    to={`/skits/${skit._id}`}
                                    className="block mt-3 text-purple-600 hover:text-purple-700 font-medium text-sm"
                                >
                                    Watch now →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    )
}
export default FanDashboard