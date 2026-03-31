import { useState, useEffect } from 'react'
import { getCreatorProfile, getCreatorStats, deactivateProfile, reactivateProfile } from '../api/creator'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'


const CreatorDashboard = () => {
    const [profile, setProfile] = useState(null)
    const [stats, setStats] = useState(null)
    const [scheduledDeletion, setScheduledDeletion] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isDeactivateModal, setIsDeactivateModal] = useState(false)
    const [error, setError] = useState('')
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const [profileRes, statsRes] = await Promise.all([
                    getCreatorProfile(),
                    getCreatorStats()
                ])
                const profileData = profileRes.data.profile

                if (!profileData) {
                    navigate('/creator/profile/create')
                    return
                }
                if (!profileData.isActive) {
                    navigate('/creator/profile/reactivate')
                    return
                }
                if (profileData.scheduledDeletion) {
                    setScheduledDeletion(profileData.scheduledDeletion)
                }

                setProfile(profileData)
                setStats(statsRes.data)
            } catch(error) {
                if (error.response?.status === 404) {
                    navigate('/creator/profile/create')
                } else {
                    setError(error.response?.data?.msg || 'Failed to fetch profile')

                }
            } finally {
                setIsLoading(false)
            }
        }
        fetchProfile()
    }, [])

    const handleDeactivate = async () => {
        try {
            await deactivateProfile()
            logout()
            navigate('/')
        } catch (error) {
            setError(error.response?.data?.msg || 'Failed to deactivate profile')
        }
    }

    const handleReactivate = async () => {
        try {
            await reactivateProfile()
            setScheduledDeletion(null)
            const response = await getCreatorProfile()
            setProfile(response.data.profile)
        } catch (error) {
            setError(error.response?.data?.msg || 'Failed to reactivate profile')
        }
    }

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>{error}</div>
    if (!profile) {
        navigate('/creator/profile/create')
        return null
    }
    

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
            {scheduledDeletion && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
                    <p className="text-red-600 font-medium">
                        ⚠️ Your profile is scheduled for deactivation on {new Date(scheduledDeletion).toLocaleDateString('en-NG', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </p>
                    <p className="text-red-400 text-sm mt-1">
                        You have active subscribers — your profile will remain active until this date.
                    </p>
                </div>
            )}
            
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
            <div className="bg-white rounded-xl p-6 shadow-sm border border-red-100 mt-8">
                <h2 className="text-xl font-bold text-red-500 mb-2">
                    Danger Zone
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                    Deactivating your account will remove your profile from SkitPay.
                    If you have active subscribers you will have a 30 day grace period.
                </p>
                <button
                    disabled={!!scheduledDeletion}
                    onClick={() => !scheduledDeletion && setIsDeactivateModal(true)}
                    className={`px-6 py-3 rounded-lg transition-colors duration-200 cursor-pointer font-medium
                        ${scheduledDeletion 
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-red-500 text-white hover:bg-red-600 cursor-pointer'
                        }`}
                >
                    {scheduledDeletion ? 'Deactivation Scheduled' : 'Deactivate Account'}
                </button>
                {scheduledDeletion && (
                    <button
                        onClick={() => handleReactivate()}
                        className="px-6 py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200 font-medium cursor-pointer"
                    >
                        Cancel Deactivation 🔄
                    </button>
                )}
                {scheduledDeletion && (
                    <p className="text-gray-400 text-sm mt-2">
                        Profile scheduled for deactivation on {new Date(scheduledDeletion).toLocaleDateString('en-NG', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </p>
                )}
            </div>
            {isDeactivateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 max-w-sm w-full">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Deactivate Account?
                        </h2>
                        <p className="text-gray-500 mb-6">
                            This action cannot be undone! If you have active subscribers
                            your account will remain active for 30 days.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={handleDeactivate}
                                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 cursor-pointer"
                            >
                                Deactivate
                            </button>
                            <button
                            onClick={() => setIsDeactivateModal(false)}
                                className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CreatorDashboard