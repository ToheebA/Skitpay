import { useState, useEffect } from 'react'
import { getCreatorProfile, getCreatorStats } from '../api/creator'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'


const CreatorDashboard = () => {
    const [profile, setProfile] = useState(null)
    const [stats, setStats] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const { user } = useAuth()

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const [profileRes, statsRes] = await Promise.all([
                    getCreatorProfile(),
                    getCreatorStats()
                ])
                setProfile(profileRes.data.profile)
                setStats(statsRes.data)
            } catch(error) {
                if (error.response?.status === 404) {
                    setProfile(null)
                } else {
                    setError(error.response?.data?.msg || 'Failed to fetch profile')

                }
            } finally {
                setIsLoading(false)
            }
        }
        fetchProfile()
    }, [])

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>{error}</div>
    if (!profile) return <div>Create your profile first!</div>

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {user.name}! 👋
                </h1>
                <p className="text-gray-500 mt-1">
                    Here's what's happening with your account
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm mb-1">Subscribers</p>
                    <h3 className="text-3xl font-bold text-purple-600">
                        {stats?.subscribers || 0}
                    </h3>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm mb-1">Total Views</p>
                    <h3 className="text-3xl font-bold text-purple-600">
                        {stats?.totalViews || 0}
                    </h3>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm mb-1">Uploaded Videos</p>
                    <h3 className="text-3xl font-bold text-purple-600">
                        {stats?.totalUploads}
                    </h3>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm mb-1">Total Earnings</p>
                    <h3 className="text-3xl font-bold text-purple-600">
                        ₦{stats?.totalEarnings || 0}
                    </h3>
                </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Profile info
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <p className="text-gray-500 text-sm mb-1">Bio</p>
                        <p className="text-gray-900 font-medium">{profile.bio}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm mb-1">Niche</p>
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium capitalize">
                            {profile.niche}
                        </span>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm mb-1">Subscription Price</p>
                        <p className="text-gray-900 font-bold text-lg">
                            ₦{profile.subscriptionPrice}/month
                        </p>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Quick Actions
                </h2>
                <div className="flex gap-4">
                    <Link 
                        to="/creator/skits"
                        className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
                    >
                        My Skits 🎬
                    </Link>
                    <Link 
                        to="/creator/upload"
                        className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium"
                    >
                        Upload Skit ⬆️
                    </Link>
                    <Link 
                        to="/creator/profile/edit"
                        className="border border-purple-600 text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors duration-200 font-medium"
                    >
                        Edit Profile ✏️
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default CreatorDashboard