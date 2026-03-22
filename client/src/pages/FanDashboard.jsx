import { useAuth } from '../context/AuthContext'

const FanDashboard = () => {
    const { user } = useAuth()
    console.log('user from context:', user)

    return <div>Fan Dashboard</div>
}
export default FanDashboard