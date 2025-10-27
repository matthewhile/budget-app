import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {

    const isAuthenticated = true;

  return <AuthContext.Provider value={{isAuthenticated}}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
