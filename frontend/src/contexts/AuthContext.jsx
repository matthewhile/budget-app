import { createContext, useContext, useState, useEffect } from "react"
import axiosClient from "../api/axiosClient"


const AuthContext = createContext()

export function AuthProvider({ children }) {

    const [token, setToken] = useState(localStorage.getItem("token") || "")
    const [isLoading, setIsLoading] = useState(!!localStorage.getItem("token"))

    useEffect(() => {
        const storedToken = localStorage.getItem("token")
        if (!storedToken) return

        axiosClient.get("/manage/info")
            .catch(() => {
                setToken("")
                localStorage.removeItem("token")
            })
            .finally(() => setIsLoading(false))
    }, [])

    async function login(email, password) {
        try {
            const response = await axiosClient.post("/login", {
                email,
                password,
            })
            const { accessToken } = response.data

            setToken(accessToken)
            localStorage.setItem("token", accessToken)
            console.log("Login succeeded")

            return true

        } catch (error) {
            console.error("Login failed:", error)
            return false
        }
    }

    function logout() {
      setToken("")
      localStorage.removeItem("token")
    }

  const value = {
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
