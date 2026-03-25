import { Link } from "react-router-dom"

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500 flex flex-col items-center justify-center text-center px-6">
            <p className="text-4xl mb-6 animate-bounce">
                🎬 🎭 💰 🎤
            </p>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Your Skits. 
                Your Fans. 
                Your Money.
            </h1>
            <p className="text-lg md:text-xl text-purple-200 max-w-2xl mb-10">
                Nigeria's first platform built specifically for skit makers.
                Connect with superfans, get paid for exclusive content,
                and land brand deals — all in one place.
            </p>
            <div className="flex gap-4 mb-16">
                <Link 
                    to="/register?role=creator"
                    className="bg-white text-purple-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-purple-50 transition-colors duration-200"
                >
                    Start Creating 🚀
                </Link>
                <Link 
                    to="/browse"
                    className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-purple-700 transition-colors duration-200"
                >
                    Watch Free Skits 🎬
                </Link>
            </div>
            <div className="flex gap-12 text-white">
                <div className="flex flex-col items-center">
                    <span className="text-3xl font-bold">500+</span> 
                    <span className="text-purple-200">Creators</span>
                </div>
                <div className="w-px bg-purple-400"></div>
                <div className="flex flex-col items-center"> 
                    <span className="text-3xl font-bold">10,000+</span> 
                    <span className="text-purple-200">Fans</span>
                </div>
                <div className="w-px bg-purple-400"></div>
                <div className="flex flex-col items-center">
                    <span className="text-3xl font-bold">₦50M+</span> 
                    <span className="text-purple-200">Paid Out</span>
                </div>
            </div>
        </div>
    )
}
export default LandingPage