import { Form, Button } from "react-bootstrap"
import { useRef, useState } from "react"
import {useAuth} from "../contexts/AuthContext"

function Login() {

    const emailRef = useRef()
    const passwordRef = useRef()

    const {login} = useAuth()

    function handleSubmit(e) {
        e.preventDefault()
        const email = emailRef.current.value
        const password = passwordRef.current.value 

        login(email, password)
    }

    return (
        <div className="account-container">
            <div className="account-box">
                <h2 className="text-center mb-4">Login</h2>
                <Form onSubmit={handleSubmit}>
                    <div className="text-danger"></div>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control ref={emailRef} type="text" required/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control ref={passwordRef} required/>
                    </Form.Group>
                    <Button type="submit">Login</Button>
                </Form>
            </div>
        </div>
    ) 
}

export default Login
