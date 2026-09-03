import { useEffect, useState } from "react"

const STORAGE_KEY = "theme"

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem(STORAGE_KEY) || getSystemTheme())

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => setTheme(getSystemTheme())
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark"
    localStorage.setItem(STORAGE_KEY, next)
    setTheme(next)
  }

  return { theme, toggleTheme }
}
