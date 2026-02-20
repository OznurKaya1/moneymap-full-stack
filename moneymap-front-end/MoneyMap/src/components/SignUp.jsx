import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LoginPage from './Images/LoginPage.jpg'


export default function SignUp() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [name, setName]= useState("")
    const [lastname, setLastName]= useState("")

    const navigate = useNavigate()

    const handleSignUp = (e) => {
        e.preventDefault()

        if (!email || !password) {
            setError("Please enter both email and password.")
            return;
        }

        if (!email.includes("@") || !email.includes(".")) {
            setError("Please enter a valid email address.")
            return;
        }

        if (!/\d/.test(password)) {
            setError("Your password must have at least one number.")
            return;
        }

        if (!/[A-Z]/.test(password)) {
            setError("Your password must have at least one capital letter.")
            return;
        }
        if(password.length < 9) {
            setError("Your password must be at least 9 characters.")
            return ;
        }
        if(!name){
            setError("Please enter your name.")
            return;
        }
        if(!lastname){
            setError("Please enter your last name.")
        }


        navigate("/home")
    }
    return (
  <div
    className='sign-up page'
    style={{
      backgroundImage: `url(${LoginPage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <form className='sign-up-container'>
      <div className='input-box'>
        <h1 className='sign-up'>Sign up</h1>
        <label htmlFor='firstName'>First name</label>
        <input
          type='text'
          id='firstName'
          name='firstName'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className='input-box'>
        <label htmlFor='lastName'>Last name</label>
        <input
          type='text'
          id='lastName'
          name='lastName'
          value={lastname}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>

      <div className='input-box'>
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          id='email'
          name='email'
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <p className='error-message'>{error}</p>}

      <button type='submit' className='btn' onClick={handleSignUp}>
        Join now
      </button>
    </form>
  </div>
);


}