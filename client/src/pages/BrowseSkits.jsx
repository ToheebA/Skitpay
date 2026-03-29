import { useState, useEffect } from 'react'
import { getAllSkits } from '../api/fan'
import { Link } from 'react-router-dom'

const BrowseSkits = () => {
    const [skits, setSkits] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [totalSkits, setTotalSkits] = useState(0)
    const [filters, setFilters] = useState({
        niche: '',
        sort: '-createdAt',
        page: 1,
        limit: 9
    })

    useEffect(() => {
        const fetchSkits = async () => {
            try {
                const response = await getAllSkits({
                    ...filters,
                    search
                })
                setSkits(response.data.skits)
                setTotalSkits(response.data.nbHits)
            } catch (error) {
                setError(error.response?.data?.msg || 'Failed to fetch skits')
            } finally {
                setIsLoading(false)
            }
        }
        fetchSkits()
    }, [filters, search])

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>{error}</div>

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Browse Skits
                </h1>
            </div>
            <div className="flex gap-4 mb-8">
                <input
                    className="flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2" 
                    type="text"
                    placeholder="Search by title or creator name"
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
                <select
                    className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2"
                    value={filters.sort}
                    onChange={(e) => setFilters({...filters, 
                        sort: e.target.value,
                        page: 1
                    })}
                >
                    <option value="-createdAt">Newest First</option>
                    <option value="createdAt">Oldest First</option>
                    <option value="-viewCount">Most Viewed</option>
                    <option value="-likes">Most Liked</option>
                </select>
            </div>
            {skits.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-gray-500 text-lg">No skits found!</p>
                    <p className="text-gray-400 text-sm">Try a different search or filter</p>
                </div>
            ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {skits.map((skit) => (
                                <div key={skit._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    <img 
                                        src={skit.thumbnailUrl} 
                                        alt={skit.title} 
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        <p className="font-bold text-gray-900">{skit.title}</p>
                                        <span className={`text-xs px-2 py-1 rounded-full ${skit.visibility === 'free' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                                            {skit.visibility}
                                        </span>
                                        <p className="text-gray-500 text-sm">
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
                                Page {filters.page} of {Math.ceil(totalSkits/filters.limit)}
                            </span>
                            <button 
                                onClick={() =>setFilters({...filters, page: filters.page + 1})}
                                disabled={filters.page >= Math.ceil(totalSkits/filters.limit)}
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
export default BrowseSkits