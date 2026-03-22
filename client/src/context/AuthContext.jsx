import { jwtDecode } from 'jwt-decode'
import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(
        localStorage.getItem('token') || null
    )

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