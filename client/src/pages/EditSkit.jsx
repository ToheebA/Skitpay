import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { updateSkit } from '../api/creator'
import { getSkit } from '../api/fan'
import toast from 'react-hot-toast'

const EditSkit = () => {
    const { id } = useParams()
    const [skit, setSkit] = useState(null)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isFetching, setIsFetching] = useState(true)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState('')
    const [videoFile, setVideoFile] = useState(null)
    const [thumbnailFile, setThumbnailFile] = useState(null)
    const [form, setForm] = useState({})
    const navigate = useNavigate()

    useEffect(() => {
        const fetchSkit = async () => {
            try {
                const response = await getSkit(id)
                const skitData = response.data.skit
                setSkit(skitData)
                setForm({
                    title: skitData.title || '',
                    description: skitData.description || '',
                    visibility: skitData.visibility || 'free',
                    tags: skitData.tags.join(', ') || ''
                })
            } catch (error) {
                setError(error.response?.data?.msg || 'Failed to fetch skit')
            } finally {
                setIsFetching(false)
            }
        }
        fetchSkit()
    }, [id])

    const handleSubmit = async (e) =>{
        e.preventDefault()
        setError('')
        if (!form.title || !form.description || !form.tags) {
            setError("Please fill in all the details and attach your files")
            return
        }
        setIsUploading(true)
        try{
            const formData = new FormData()
            formData.append('title', form.title)
            formData.append('description', form.description)
            formData.append('visibility', form.visibility)
            formData.append('tags', form.tags)
            if (videoFile) formData.append('video', videoFile)
            if (thumbnailFile) formData.append('thumbnail', thumbnailFile)
            await updateSkit(id, formData, (progressEvent) => {
                const progress = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                )
                setUploadProgress(progress)
            })
            toast.success('Skit updated successfully!')
            navigate('/creator/skits')
        } catch (error) {
            setError(error.response?.data?.msg || 'Unable to edit skit')
        } finally {
            setIsUploading(false)
            setUploadProgress(0)
        }
    }

    if (isFetching) return <div>Loading...</div>
    if (error) return <div>{error}</div>
    if (!skit) return <div>Skit not found!</div>

    return (
        <div className="min-h-screen flex flex-col gap-4 items-center justify-center mt-2">
            <form onSubmit = {handleSubmit} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-4">
                <div className="flex items-center gap-3 mb-2">
                    <button 
                        type="button"
                        onClick={() => navigate('/creator/dashboard')}
                        className="text-gray-500 hover:text-purple-600 cursor-pointer"
                    >
                        ← Back
                    </button>
                    <h1 className="text-2xl font-bold text-purple-600">Edit Skit</h1>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-medium">Title</label>
                    <input
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2" 
                        type="text"
                        value={form.title} 
                        placeholder="title"
                        onChange={(e) => setForm({...form,
                            title: e.target.value})}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-medium">Description</label>
                    <span className="text-gray-400 text-sm">{form.description.length || 0}/250</span>
                    <textarea
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2"
                        type="text"
                        value={form.description} 
                        placeholder="description" 
                        maxLength="250"
                        onChange={(e) => setForm({...form,
                            description: e.target.value})}
                    >
                    </textarea>
                </div> 
                <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-medium">Visibility</label>
                    <select 
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2"
                        value={form.visibility}
                        onChange={(e) => setForm({...form,
                            visibility: e.target.value})}
                    >
                        <option value="free">free</option>
                        <option value="paid">paid</option>
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-medium">Tags</label>
                    <input 
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2"
                        type="text"
                        value={form.tags} 
                        placeholder="e.g comedy, lagos..."
                        onChange={(e) => setForm({...form,
                            tags: e.target.value
                        })}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-medium">Select Video</label>
                    <input 
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2"
                        type="file"
                        accept="video/*"
                        onChange={(e) => setVideoFile(e.target.files[0])}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-medium">Select Thumbnail</label>
                    <input 
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setThumbnailFile(e.target.files[0])}
                    />
                </div>
                <button
                    className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 cursor-pointer transition-colors duration-200"
                    type="submit"
                    disabled={isUploading}
                >
                    {isUploading ? 'Uploading Edit...' : 'Upload Edit'}
                </button>
                {isUploading && (
                    <div className="w-full">
                        <div className="flex justify-between text-sm text-gray-500 mb-1">
                            <span>Uploading Edit...</span>
                            <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                                className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            >
                            </div>
                        </div>
                    </div>
                )}
                {error && <p className="text-red-500">{error}</p>}
            </form>
        </div>
    )
}

export default EditSkit