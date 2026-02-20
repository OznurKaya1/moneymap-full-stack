import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'



export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleLogin = (e) => {
        e.preventDefault()

        if (!email || !password) {
            setError("Please enter both email and password.")
            return
        }

        if (!email.includes("@") || !email.includes(".")) {
            setError("Please enter a valid email address.")
            return
        }

        if (!/\d/.test(password)) {
            setError("Your password must have at least one number.")
            return
        }

        if (!/[A-Z]/.test(password)) {
            setError("Your password must have at least one capital letter.")
            return
        }
        if(password.length < 9){
            setError("Your password must be at least 9 characters long.")
            return
        }


        navigate("/home")
    }

    return (
        <div 
        className='login-page'>
            <form className='login-container'>
                <div className='input-box'>
                    <h1 className='login'>Login</h1>
                    <label htmlFor='email'>Email</label>
                    <input
                        type='email'
                        id='email'
                        name='email'
                        placeholder='Enter Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className='input-box'>
                    <label htmlFor='password'>Password</label>
                    <input
                        type='password'
                        id='password'
                        name='password'
                        placeholder='Enter Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <p className='error-message'>{error}</p>}

                <button type='submit' className='btn' onClick={handleLogin}>Login</button>

                <div className='login-links'>
                    <Link to='/signup' className="clickable-underline">
                        Don't have an account?
                    </Link>
                    <Link to='/forgotmypassword' className="clickable-underline">
                        Forgot password?
                    </Link>
               </div>
            </form>
        </div>
    )
}
