import { useState, useEffect } from 'react'
import { getCreatorSkits, deleteSkit } from '../api/creator'
import { Link, useNavigate } from 'react-router-dom'

const ManageSkits = () => {
    const [skits, setSkits] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [isModal, setIsModal] = useState(false)
    const [skitToDelete, setSkitToDelete] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchSkits = async () => {
            try{
                const response = await getCreatorSkits()
                setSkits(response.data.skits)
            } catch (error) {
                setError(error.response?.data?.msg || 'Failed to fetch skits')
            } finally {
                setIsLoading(false)
            }
        }
        fetchSkits()
    }, [])

    const handleDeleteClick = (skitId) => {
        setSkitToDelete(skitId)
        setIsModal(true)
    }

    const handleDeleteConfirm = async () => {
        try {
            await deleteSkit(skitToDelete)
            setSkits(skits.filter(skit => skit._id !== skitToDelete))
            setIsModal(false)
            setSkitToDelete(null)
        } catch (error) {
            setError(error.response?.data?.msg || 'Failed to delete skit')
        }
    }

    const handleDeleteCancel = () => {
        setIsModal(false)
        setSkitToDelete(null)
    }

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>{error}</div>
    if (skits.length === 0) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
            <p className="text-gray-500 text-lg">No skits yet!</p>
            <Link 
                to="/creator/upload"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
            >
                + Upload Your First Skit
            </Link>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    My Skits
                </h1>
                <Link 
                    to="/creator/upload"
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
                >
                    + Upload New Skit
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {skits.map((skit) => (
                    <div key={skit._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <a href={skit.videoUrl}>
                            <img 
                                src={skit.thumbnailUrl} 
                                alt={skit.title} 
                                className="w-full h-48 object-cover"
                            />
                        </a>
                        <div className="p-4">
                            <p className="font-bold text-gray-900">{skit.title}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${skit.visibility === 'free' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                                {skit.visibility}
                            </span>
                            <p className="text-gray-500 text-sm">
                                {skit.viewCount} views · {skit.likes.length} likes
                            </p>
                            <div className="flex gap-2 mt-3">
                                <button 
                                    onClick={() => handleDeleteClick(skit._id)}
                                    className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 text-sm"
                                >
                                    Delete
                                </button>
                                <button 
                                    onClick={() => navigate(`/creator/skits/${skit._id}/edit`)}
                                    className="flex-1 border border-purple-600 text-purple-600 py-2 rounded-lg hover:bg-purple-50 text-sm"
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {isModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 max-w-sm w-full">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Delete Skit?
                        </h2>
                        <p className="text-gray-500 mb-6">
                            This action cannot be undone!
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={handleDeleteConfirm}
                                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                            >
                                Delete
                            </button>
                            <button
                                onClick={handleDeleteCancel}
                                className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {error && <p className="text-red-500">{error}</p>}
        </div>
    )
}
export default ManageSkits