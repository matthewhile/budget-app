import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BudgetsProvider } from './contexts/BudgetContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BudgetsProvider>
        <App />
      </BudgetsProvider>
    </AuthProvider>
  </StrictMode>,
)
