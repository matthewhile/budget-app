import '../styles/Login.css';
import { Form, Button } from "react-bootstrap"
import { useRef, useState } from "react"
import {useAuth} from "../contexts/AuthContext"
import { FaEye, FaEyeSlash } from "react-icons/fa6";

function Login() {

    const emailRef = useRef()
    const passwordRef = useRef()
    const {login} = useAuth()
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        const email = emailRef.current.value
        const password = passwordRef.current.value 

        const success = await login(email, password)

        if (!success) {
            setError("Invalid Email or Password! Please try again.")
        }
    }

    function togglePasswordVisibility() {
        setShowPassword(prev => !prev)
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="text-center mb-4">Login</h2>
                <Form onSubmit={handleSubmit}>
                    <div className="text-danger mb-3">{error}</div>
                    <Form.Group className="mb-3">
                        <Form.Label className="login-label">Email</Form.Label>
                        <Form.Control ref={emailRef} type="text" required/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="login-label">Password</Form.Label>
                        <div className="password-wrapper">
                            <Form.Control ref={passwordRef} id="passwordField" type={showPassword ? "text" : "password"} required></Form.Control>
                            <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                                {showPassword ? (<FaEyeSlash size={20} />) : (<FaEye size={20} />)}
                            </span>
                        </div>
                    </Form.Group>
                    <Button className="login-btn" type="submit">Login</Button>
                </Form>
            </div>
        </div>
    ) 
}

export default Login
