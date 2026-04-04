import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const LandingPage = () => {
    const { user } = useAuth()

    const [activeTab, setActiveTab] = useState('creator')
    return (
        <div>
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500 
                flex flex-col items-center justify-center text-center px-4 md:px-6 pt-32 md:pt-0">
                <p className="text-4xl mb-6 animate-bounce">
                    🎬 🎭 💰 🎤
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                    Your Skits. 
                    Your Fans. 
                    Your Money.
                </h1>
                <p className="text-lg md:text-xl text-purple-200 max-w-2xl mb-10">
                    Nigeria's first platform built specifically for skit makers.
                    Connect with superfans, get paid for exclusive content,
                    and land brand deals — all in one place.
                </p>
                <div className="flex flex-col md:flex-row gap-4 mb-16">
                    {user?.role === 'creator' ? (
                        <Link 
                            to="/creator/dashboard"
                            className="bg-white text-purple-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-purple-50 transition-colors duration-200"
                        >
                            Go to Dashboard 🚀
                        </Link>
                    ) : (
                        <Link 
                            to="/register"
                            className="bg-white text-purple-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-purple-50 transition-colors duration-200"
                        >
                            Start Creating 🚀
                        </Link>
                    )}
                    <Link 
                        to="/browse"
                        className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-purple-700 transition-colors duration-200"
                    >
                        Watch Free Skits 🎬
                    </Link>
                </div>
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 text-white">
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold">500+</span> 
                        <span className="text-purple-200">Creators</span>
                    </div>
                    <div className="hidden md:block w-px bg-purple-400"></div>
                    <div className="flex flex-col items-center"> 
                        <span className="text-3xl font-bold">10,000+</span> 
                        <span className="text-purple-200">Fans</span>
                    </div>
                    <div className="hidden md:block w-px bg-purple-400"></div>
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold">₦50M+</span> 
                        <span className="text-purple-200">Paid Out</span>
                    </div>
                </div>
            </div>
            <section className="py-12 md:py-20 px-4 md:px-6 bg-gray-50">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Everything you need
                    </h2>
                    <p className="text-gray-500 text-lg max-w-xl mx-auto">
                        Whether you're a creator or a fan, SkitPay has you covered
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                        <h3 className="text-2xl font-bold text-purple-600 mb-6">
                            For Creators 🎬
                        </h3>
                        <div className="flex flex-col gap-6">
                            <div className="flex gap-4">
                                <span className="text-3xl">💰</span>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Get Paid</h4>
                                    <p className="text-gray-500">Earn from fan subscriptions and brand deals</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-3xl">🎬</span>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Upload Skits</h4>
                                    <p className="text-gray-500">Share your amazing content with fans</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-3xl">🤝</span>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Brand Deals</h4>
                                    <p className="text-gray-500">Endorse popular brands and get paid</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                        <h3 className="text-2xl font-bold text-purple-600 mb-6">
                            For Fans ❤️
                        </h3>
                        <div className="flex flex-col gap-6">
                            <div className="flex gap-4">
                                <span className="text-3xl">❤️</span>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Support Creators</h4>
                                    <p className="text-gray-500">Show your favourite creators love by subscribing</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-3xl">🔒</span>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Exclusive Content</h4>
                                    <p className="text-gray-500">Enjoy exclusive content from your favourite creators</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-3xl">🎭</span>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Direct Connection</h4>
                                    <p className="text-gray-500">Engage with your favourite creators directly</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-12 md:py-20 px-4 md:px-6 bg-white">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            How It Works
                    </h2>
                    <p className="text-gray-500 text-lg">
                        Get started in 3 simple steps
                    </p>
                </div>
                <div className="flex flex-col md:flex-row justify-center gap-4 mb-12">
                    <button 
                        onClick={() => setActiveTab('creator')}
                        className={`px-6 py-3 rounded-full font-bold transition-colors duration-200 cursor-pointer
                            ${activeTab === 'creator'
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        For Creators
                    </button>
                    <button 
                        onClick={() => setActiveTab('fan')}
                        className={`px-6 py-3 rounded-full font-bold transition-colors duration-200 cursor-pointer
                            ${activeTab === 'fan' 
                                ? 'bg-purple-600 text-white' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        For Fans
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {activeTab === 'creator' ? (
                        <>
                            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl">
                                <span className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">1</span>
                                <h4 className="font-bold text-gray-900 text-lg mb-2">Create Profile</h4>
                                <p className="text-gray-500">Set up your bio, niche and subscription price</p>
                            </div>
                            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl">
                                <span className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">2</span>
                                <h4 className="font-bold text-gray-900 text-lg mb-2">Upload Exclusive Skits</h4>
                                <p className="text-gray-500">Upload your skit video and a captivating thumbnail</p>     
                            </div>
                            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl">
                                <span className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">3</span>
                                <h4 className="font-bold text-gray-900 text-lg mb-2">Get Paid</h4>
                                <p className="text-gray-500">Loyal fans subscribe and brands reach out</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl">
                                <span className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">1</span>
                                <h4 className="font-bold text-gray-900 text-lg mb-2">Browse Creators</h4>
                                <p className="text-gray-500">Find your favourite skit makers</p>
                            </div>
                            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl">
                                <span className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">2</span>
                                <h4 className="font-bold text-gray-900 text-lg mb-2">Subscribe</h4>
                                <p className="text-gray-500">Pay to access exclusive content</p>
                            </div>
                            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl">
                                <span className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">3</span>
                                <h4 className="font-bold text-gray-900 text-lg mb-2">Enjoy</h4>
                                <p className="text-gray-500">Watch exclusive skits, engage directly</p>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    )
}
export default LandingPage