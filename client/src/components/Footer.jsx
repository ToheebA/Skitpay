import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-400 py-8 px-6">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <h1 className="text-xl font-bold text-purple-400">SkitPay</h1>
                <div className="flex gap-6">
                    <Link to='/browse' className="hover:text-purple-400">Browse</Link>
                    <Link to='/creators' className="hover:text-purple-400">Creators</Link>
                    <Link to='/login' className="hover:text-purple-400">Login</Link>
                    <Link to='/register' className="hover:text-purple-400">Register</Link>
                </div>
                <p>© 2026 SkitPay 🇳🇬</p>
            </div>
        </footer>
    )
}

export default Footer