import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { verifyPayment } from '../api/payment'
import Spinner from '../components/Spinner'

const PaymentVerify = () => {
    const [searchParams] = useSearchParams()
    const [status, setStatus] = useState('verifying')
    const navigate = useNavigate()
    const reference = searchParams.get('reference')

    useEffect(() => {
        const verify = async () => {
            try {
                await verifyPayment(reference)
                setStatus('success')
                setTimeout(() => navigate('/fan/dashboard'), 3000)
            } catch (error) {
                setStatus('failed')
            }
        }
        if (reference) {
            verify()
        } else {
            setStatus('failed')
        }
    }, [reference])

    if (status === 'verifying') return <Spinner />

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-xl p-8 max-w-md w-full text-center shadow-sm">
                {status === 'success' ? (
                    <>
                        <p className="text-6xl mb-4">🎉</p>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Payment Successful!
                        </h1>
                        <p className="text-gray-500 mb-6">
                            You are now subscribed! Redirecting to dashboard...
                        </p>
                        <Link
                            to="/fan/dashboard"
                            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
                        >
                            Go to Dashboard
                        </Link>
                    </>
                ) : (
                    <>
                        <p className="text-6xl mb-4">❌</p>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Payment Failed!
                        </h1>
                        <p className="text-gray-500 mb-6">
                            Something went wrong with your payment.
                        </p>
                        <Link
                            to="/creators"
                            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
                        >
                            Try Again
                        </Link>
                    </>
                )}
            </div>
        </div>
    )
}
export default PaymentVerify