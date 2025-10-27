import { useAuth } from "./contexts/AuthContext.jsx"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"

function App() {
  const { isAuthenticated } = useAuth()

  // show login if user is not authenticated
  if (!isAuthenticated) {
    return <Login />
  }

  // otherwise, show the main dashboard
  return <Dashboard />
}

export default App
