import React from 'react'

import background from './Images/background.jpg'
import { Link } from 'react-router-dom'
import Login from './Login'

export default function HomePage() {
  return (
    <div className='home-page-container'>
      <div className="home-page-background"

        style={{ backgroundImage: `url(${background})` }}

      >

        <h1 className="app-name">MoneyMap</h1>
        <h3 className="map-your-wealth">Map Your Wealth</h3>
        <div className="login-wrapper">
          <Login />
        </div>
      </div>
    </div>
  )
}
