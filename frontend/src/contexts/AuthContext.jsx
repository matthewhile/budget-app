import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios";

const AuthContext = createContext()

export function AuthProvider({ children }) {

    const [token, setToken] = useState('')

    async function login(email, password) {
        debugger;
        try {
            const response = await axios.post("http://localhost:5023/login", {
                email,
                password,
            })
            const { token } = response.data

            //   localStorage.setItem("token", token)
            //   axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
            setToken(token)
            //   setUser({ name: email })
            return true
        } catch (error) {
            console.error("Login failed:", error)
            return false
        }
    }

  const value = {
    token,
    isAuthenticated: !!token,
    login
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

//   return <AuthContext.Provider value={{isAuthenticated}}>{children}</AuthContext.Provider>

export function useAuth() {
  return useContext(AuthContext)
}
