import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
    const { user } = useAuth()
    const [socket, setSocket] = useState(null)

    useEffect(() => {
        if (!user) return

        const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
            query: { userId: user.userId }
        })

        newSocket.on('connect', () => {
            console.log('Connected to socket server!')
        })

        newSocket.on('notification', (data) => {
            toast.success(data.message, {
                duration: 5000,
                icon: '🔔'
            })
        })

        newSocket.on('disconnect', () => {
            console.log('Disconnected from socket server!')
        })

        setSocket(newSocket)

        return () => newSocket.disconnect()
    }, [user])

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => useContext(SocketContext)