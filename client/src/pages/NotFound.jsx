import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
            <p className="text-8xl mb-6">🎬</p>
            <h1 className="text-6xl font-bold text-purple-600 mb-4">404</h1>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Looks like this skit doesn't exist!
            </h2>
            <p className="text-gray-500 mb-8 max-w-md">
                The page you're looking for has been removed, 
                renamed or never existed in the first place.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
                <Link 
                    to="/"
                    className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
                >
                    Go Home
                </Link>
                <Link 
                    to="/browse"
                    className="border border-purple-600 text-purple-600 px-8 py-3 rounded-lg hover:bg-purple-50 transition-colors duration-200 font-medium"
                >
                    Browse Skits 🎭
                </Link>
            </div>
        </div>
    )
}
export default NotFound