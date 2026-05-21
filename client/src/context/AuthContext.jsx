import { jwtDecode } from 'jwt-decode'
import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();
const isTokenExpired = (token) => {
    const decoded = jwtDecode(token)
    return decoded.exp * 1000 < Date.now()
}

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => {
        const storedToken = localStorage.getItem('token')
        if (storedToken && !isTokenExpired(storedToken)) {
            return storedToken
        }
        localStorage.removeItem('token')
        return null
    })

    const user = token ? jwtDecode(token) : null

    const login = (token) => {
        setToken(token)
        localStorage.setItem('token', token)
    }

    const logout = () => {
        setToken(null)
        localStorage.removeItem('token')
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)