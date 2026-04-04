import { getSkit, likeSkit } from '../api/fan'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/Spinner'
import { optimizeImage } from '../utils/cloudinary'

const SingleSkit = () => {
    const { id } = useParams()
    const [skit, setSkit] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [imageLoaded, setImageLoaded] = useState(false)
    const [error, setError] = useState('')
    const { user } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchSkit = async () => {
            try {
                const response = await getSkit(id)
                setSkit(response.data.skit)
            } catch (error) {
                setError(error.response?.data?.msg || 'Failed to fetch skit')
            } finally {
                setIsLoading(false)
            }
        }
        fetchSkit()
    }, [id])

    const isLiked = skit?.likes?.some(id => id.toString() === user?.userId)

    const handleLike = async () => {
        try {
            if (!user) return navigate('/login')
            const response = await likeSkit(skit._id)
            const alreadyLiked = skit.likes.some(id => id.toString() === user.userId)
            setSkit({
                ...skit,
                likes: alreadyLiked 
                    ? skit.likes.filter(id => id.toString() !== user.userId)
                    : [...skit.likes, user.userId]
            })
        } catch (error) {
            setError(error.response?.data?.msg || 'Failed to like skit')
        }
    }

    if (isLoading) return <Spinner />
    if (error) return <div>{error}</div>
    if (!skit) return <div>Skit not found!</div>

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {skit.videoUrl ? (
                        <video 
                            src={skit.videoUrl} 
                            controls
                            className="w-full rounded-xl"
                        />
                    ) : (
                        <div className="relative">
                            <div className="relative w-full h-48">    
                                {!imageLoaded && (
                                    <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-t-xl" />
                                )}
                                <img 
                                    src={optimizeImage(skit.thumbnailUrl)} 
                                    alt={skit.title}
                                    loading="lazy"
                                    onLoad={() => setImageLoaded(true)} 
                                    className={`w-full h-48 object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                />
                            </div>
                            <div className="absolute inset-0 bg-black bg-opacity-60 rounded-xl flex flex-col items-center justify-center gap-4">
                                <p className="text-white font-bold text-xl">🔒 Exclusive Content</p>
                                {!user ? (
                                    <Link to="/register" className="bg-purple-600 text-white px-6 py-3 rounded-lg">
                                        Sign up to watch
                                    </Link>
                                ) : (
                                    <Link to="/creators" className="bg-purple-600 text-white px-6 py-3 rounded-lg">
                                        Subscribe to watch
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="mt-4">
                        <h1 className="text-2xl font-bold text-gray-900">{skit.title}</h1>
                        <div className="flex items-center gap-4 mt-2">
                            <span>{skit.viewCount} views</span>
                            <span>{skit.likes.length} likes</span>
                            <button onClick={handleLike}>
                                {isLiked ? '❤️ Liked' : '🤍 Like'}
                            </button>
                        </div>
                        <p className="text-gray-500 mt-4">{skit.description}</p>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4">About the Creator</h3>
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs capitalize">
                            {skit.niche}
                        </span>
                        <div className="flex gap-4 mt-4">
                            <Link 
                                to={`/creators`}
                                className="w-full text-center bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 mt-4"
                            >
                                Find more creators
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
export default SingleSkit