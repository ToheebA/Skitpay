import { useState, useEffect } from 'react'
import { getCreatorProfile, updateCreatorProfile } from '../api/creator'
import { useNavigate } from 'react-router-dom'

const EditProfile = () => {
    const [profile, setProfile] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const [form, setForm] = useState({
        bio: '',
        niche: '',
        subscriptionPrice: 0,
        socialLinks: {
            instagram: '',
            tiktok: '',
            facebook: '',
            snapchat: ''
        }
    })

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getCreatorProfile()
                const profile = response.data.profile
                setProfile(profile)
                setForm({           // ← pre-fill form here!
                bio: profile.bio || '',
                niche: profile.niche || '',
                subscriptionPrice: profile.subscriptionPrice || 0,
                socialLinks: {
                    instagram: profile.socialLinks?.instagram || '',
                    tiktok: profile.socialLinks?.tiktok || '',
                    facebook: profile.socialLinks?.facebook || '',
                    snapchat: profile.socialLinks?.snapchat || ''
                }
            })
            } catch (error) {
                setError(error.response?.data?.msg || 'Failed to fetch profile')
            } finally {
                setIsLoading(false)
            }
        }
        fetchProfile()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (!form.bio || !form.niche || !form.socialLinks) {
            setError('Please fill in all fields')
            return
        }
        setIsLoading(true)
        try {
            await updateCreatorProfile(form)
            navigate('/creator/dashboard')
        } catch (error) {
            setError(error.response?.data?.msg || 'Unable to edit profile')
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>{error}</div>
    if (!profile) return <div>No profile to edit, create a profile first!</div>

    return (
        <div className="min-h-screen flex flex-col gap-4 items-center justify-center mt-2">
            <form onSubmit = {handleSubmit} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-4">
                <h1 className="text-3xl font-bold text-purple-600 text-center mb-2">
                    SkitPay
                </h1>
                <h2 className="text-gray-500 text-center mb-6">
                    Edit Profile
                </h2>
                <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-medium">Bio</label>
                    <input 
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2" 
                        type="text" 
                        placeholder="Bio" 
                        value={form.bio} 
                        onChange={(e) => setForm({...form, 
                            bio: e.target.value})} 
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-medium">Niche</label>
                    <select
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2"
                        value={form.niche}
                        onChange={(e) => setForm({...form, niche: e.target.value})}
                    >
                        <option value="">Select niche</option>
                        <option value="comedy">Comedy</option>
                        <option value="skits">Skits</option>
                        <option value="music">Music</option>
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
                <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-medium">Subscription Price</label>
                    <input 
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2" 
                        type="number" 
                        placeholder="Subscription Price" 
                        value={form.subscriptionPrice} 
                        onChange={(e) => setForm({...form, 
                            subscriptionPrice: e.target.value})} 
                    />
                </div>
                <p className="text-gray-700 font-bold text-lg">Social Links</p>
                <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-medium">Instagram</label>
                    <input 
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2" 
                        type="text" 
                        placeholder="Instagram handle" 
                        value={form.socialLinks.instagram} 
                        onChange={(e) => setForm({...form, 
                            socialLinks: {...form.socialLinks, instagram: e.target.value}
                        })} 
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-medium">Tiktok</label>
                    <input 
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2" 
                        type="text" 
                        placeholder="Tiktok username" 
                        value={form.socialLinks.tiktok} 
                        onChange={(e) => setForm({...form, 
                            socialLinks: {...form.socialLinks, tiktok: e.target.value}
                        })} 
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-medium">Facebook</label>
                    <input 
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2" 
                        type="text" 
                        placeholder="Facebook username" 
                        value={form.socialLinks.facebook} 
                        onChange={(e) => setForm({...form, 
                            socialLinks: {...form.socialLinks, facebook: e.target.value}
                        })} 
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-medium">Snapchat</label>
                    <input 
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2" 
                        type="text" 
                        placeholder="Snapchat" 
                        value={form.socialLinks.snapchat} 
                        onChange={(e) => setForm({...form, 
                            socialLinks: {...form.socialLinks, snapchat: e.target.value}
                        })} 
                    />
                </div>
                <button
                    className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 cursor-pointer transition-colors duration-200"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? 'Updating...' : 'Update'}
                </button>
                {error && <p className="text-red-500">{error}</p>}
            </form>
        </div>
    )
}
export default EditProfile