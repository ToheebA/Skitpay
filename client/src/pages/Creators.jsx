import { getAllCreators, activateSubscription, getSubscriptions } from '../api/fan'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import useDebounce from '../hooks/useDebounce'
import Spinner from '../components/Spinner'

const Creators = () => {
    const [creators, setCreators] = useState([])
    const [subscribedCreatorIds, setSubscribedCreatorIds] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const debouncedSearch = useDebounce(search, 500)
    const [totalCreators, setTotalCreators] = useState(0)
    const { user } = useAuth()
    const navigate = useNavigate()
    const [filters, setFilters] = useState({
        niche: '',
        page: 1,
        limit: 9
    })

    useEffect(() => {
        const fetchCreators = async () => {
            try {
                const [creatorsRes, subscriptionsRes] = await Promise.all([
                    getAllCreators({ ...filters, search: debouncedSearch }),
                    user ? getSubscriptions() : Promise.resolve({ data: { subscriptions: [] } }) 
                ])
                setCreators(creatorsRes.data.creators)
                setTotalCreators(creatorsRes.data.nbHits)

                const subscribedIds = subscriptionsRes.data.subscriptions
                    .map(sub => sub.creator._id)
                setSubscribedCreatorIds(subscribedIds)
            } catch (error) {
                setError(error.response?.data?.msg || 'Failed to fetch creators')
            } finally {
                setIsLoading(false)
            }
        }
        fetchCreators()
    }, [filters, debouncedSearch])

    const isSubscribed = (creatorUserId) => {
        return subscribedCreatorIds.includes(creatorUserId)
    }

    const handleSubscribe = async (creatorProfileId, creatorUserId) => {
        if (!user) return navigate('/register')
        try {
            await activateSubscription(creatorProfileId)
            setSubscribedCreatorIds([...subscribedCreatorIds, creatorUserId])
            toast.success('Subscribed successfully!')
        } catch (error) {
            setError(error.response?.data?.msg || 'Failed to subscribe')
        }
    }

    if (isLoading) return <Spinner />
    if (error) return <div>{error}</div>

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Browse Creators
                </h1>
            </div>
            <div className="flex gap-4 mb-8">
                <input
                    className="flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2" 
                    type="text"
                    placeholder="Search by creator name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select 
                    className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2"
                    value={filters.niche} 
                    onChange={(e) => setFilters({...filters, 
                        niche: e.target.value,
                        page: 1
                    })}
                >
                    <option value="">All Niches</option>
                    <option value="comedy">Comedy</option>
                    <option value="music">Music</option>
                    <option value="skits">Skits</option>
                    <option value="dance">Dance</option>
                    <option value="fashion">Fashion</option>
                    <option value="food">Food</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="education">Education</option>
                    <option value="gaming">Gaming</option>
                    <option value="sports">Sports</option>
                    <option value="news">News</option>
                    <option value="travel">Travel</option>
                </select>
            </div>
            {creators.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-gray-500 text-lg">No creators found!</p>
                    <p className="text-gray-400 text-sm">Try a different search or filter</p>
                </div>
            ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {creators.map((creator) => (
                                <Link to={`/creators/${creator._id}`} className="block">
                                    <div key={creator._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="p-4">
                                            <Link to={`/creators/${creator._id}`}>
                                                <h3 className="font-bold text-gray-900 text-lg mb-1 hover:text-purple-600 transition-colors duration-200">
                                                    {creator.user.name}
                                                </h3>
                                            </Link>                                        
                                            <p className="text-gray-500 text-sm mb-3">{creator.bio}</p>
                                            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium capitalize mb-3 inline-block">
                                                {creator.niche}
                                            </span>
                                            <p className="text-gray-900 font-bold mb-4">₦{creator.subscriptionPrice}/month</p>
                                            <div className="flex gap-2">    
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        e.preventDefault()
                                                        !isSubscribed(creator.user._id) && handleSubscribe(creator._id, creator.user._id
                                                    )}}
                                                    disabled={isSubscribed(creator.user._id)}
                                                    className={`w-full py-2 rounded-lg transition-colors duration-200 font-medium
                                                        ${isSubscribed(creator.user._id) 
                                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                                            : 'bg-purple-600 text-white hover:bg-purple-700 cursor-pointer'
                                                        }`}
                                                >
                                                    {isSubscribed(creator.user._id) ? 'Subscribed ✓' : 'Subscribe'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div>
                            <button 
                                onClick={() =>setFilters({...filters, 
                                    page: filters.page - 1})}
                                disabled={filters.page === 1}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span>
                                Page {filters.page} of {Math.ceil(totalCreators/filters.limit)}
                            </span>
                            <button 
                                onClick={() =>setFilters({...filters, page: filters.page + 1})}
                                disabled={filters.page >= Math.ceil(totalCreators/filters.limit)}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50"
                            >
                                Next
                            </button>        
                        </div>
                    </>
                )}
            {error && <p className="text-red-500">{error}</p>}
        </div>
    )
}
export default Creators