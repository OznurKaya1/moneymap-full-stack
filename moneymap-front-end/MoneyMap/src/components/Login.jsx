import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../services/authService'

export default function Login() {

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [error,setError] = useState("")

const navigate = useNavigate()

const handleLogin = async (e) => {

e.preventDefault()
setError("")

if(!email || !password){
setError("Please enter both email and password.")
return
}

try{

const user = await login(email,password)

if(!user){
setError("Login failed")
return
}

navigate("/home")

}catch(err){

setError(err.message || "Login failed")

}

}

return(

<div className='login-page'>

<form className='login-container'>

<h1>Login</h1>

<input
type="email"
placeholder="Enter Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Enter Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

{error && <p>{error}</p>}

<button onClick={handleLogin}>Login</button>

<div>

<Link to="/signup">
Don't have an account?
</Link>

<Link to="/forgotmypassword">
Forgot password?
</Link>

</div>

</form>

</div>

)

}