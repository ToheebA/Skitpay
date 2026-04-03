import { getCreatorPublicProfile, getSubscriptions, activateSubscription } from "../api/fan"
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const CreatorProfile = () => {
    const { user } = useAuth()
    const { id } = useParams()
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null)
    const [skits, setSkits] = useState([])
    const [subscriberCount, setSubscriberCount] = useState(0)
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchCreator = async () => {
            try {
                const [ProfileRes, SubscriptionRes] = await Promise.all([
                    getCreatorPublicProfile(id),
                    user ? getSubscriptions() : Promise.resolve({ data: { subscriptions: [] } })
                ])
                setProfile(ProfileRes.data.profile)
                setSkits(ProfileRes.data.skits)
                setSubscriberCount(ProfileRes.data.subscriberCount)

                const subscribedIds = SubscriptionRes.data.subscriptions
                    .map(sub => sub.creator._id)
                setIsSubscribed(subscribedIds.includes(ProfileRes.data.profile.user._id))
            } catch (error) {
                setError(error.response?.data?.msg || 'Failed to fetch creator')
            } finally {
                setIsLoading(false)

            }

        }
        fetchCreator()
    }, [id])

    const handleSubscribe = async () => {
        if (!user) return navigate('/register')
        try {
            await activateSubscription(id)
            toast.success('Subscribed successfully!')
            setIsSubscribed(true)
        } catch (error) {
            setError(error.response?.data?.msg || 'Failed to subscribe')
        }
    }

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>{error}</div>

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {profile.user.name}
                            </h1>
                            <p className="text-gray-500 mb-3">{profile.bio}</p>
                            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium capitalize mb-3 inline-block">
                                {profile.niche}
                            </span>
                            <p className="text-gray-500 text-sm mt-2">
                                {subscriberCount} subscribers
                            </p>
                            <div className="flex gap-4 mt-4">
                                {profile.socialLinks?.instagram && (
                                    <a 
                                        href={`https://instagram.com/${profile.socialLinks.instagram}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                                    >
                                        Instagram
                                    </a>
                                )}
                                {profile.socialLinks?.tiktok && (
                                    <a 
                                        href={`https://tiktok.com/@${profile.socialLinks.tiktok}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                                    >
                                        TikTok
                                    </a>
                                )}
                                {profile.socialLinks?.facebook && (
                                    <a 
                                        href={`https://facebook.com/${profile.socialLinks.facebook}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                                    >
                                        Facebook
                                    </a>
                                )}
                                {profile.socialLinks?.snapchat && (
                                    <a 
                                        href={`https://snapchat.com/add/${profile.socialLinks.snapchat}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                                    >
                                        Snapchat
                                    </a>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-4 bg-gray-50 rounded-xl p-6">
                            <p className="text-2xl font-bold text-gray-900">
                                ₦{profile.subscriptionPrice}
                                <span className="text-gray-400 text-sm font-normal">/month</span>
                            </p>
                            <button
                                onClick={handleSubscribe}
                                disabled={isSubscribed}
                                className={`w-full px-8 py-3 rounded-lg font-medium transition-colors duration-200
                                    ${isSubscribed
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        : 'bg-purple-600 text-white hover:bg-purple-700 cursor-pointer'
                                    }`}
                            >
                                {isSubscribed ? 'Subscribed ✓' : 'Subscribe'}
                            </button>
                            {!user && (
                                <p className="text-gray-400 text-xs text-center">
                                    <Link to="/register" className="text-purple-600">
                                        Sign up
                                    </Link> to subscribe
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Skits
                    </h2>
                    {skits.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl">
                            <p className="text-gray-500">No skits yet!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {skits.map(skit => (
                                <div key={skit._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="relative">
                                        <img
                                            src={skit.thumbnailUrl}
                                            alt={skit.title}
                                            className="w-full h-48 object-cover"
                                        />
                                        {skit.visibility === 'paid' && !isSubscribed && (
                                            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                                                <span className="text-white text-2xl">🔒</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <p className="font-bold text-gray-900 mb-2">{skit.title}</p>
                                        <span className={`text-xs px-2 py-1 rounded-full ${skit.visibility === 'free' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                                            {skit.visibility}
                                        </span>
                                        <p className="text-gray-500 text-sm mt-2">
                                            {skit.viewCount} views · {skit.likes.length} likes
                                        </p>
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
                    )}
                </div>
            </div>
        </div>
    )
}

export default CreatorProfile