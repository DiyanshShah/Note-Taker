import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/NotFound.css'

function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-header">
          <h1 className="not-found-title">404</h1>
          <div className="not-found-subtitle">
            Oops! The page you're looking for doesn't exist.
          </div>
        </div>
        <div className="separator"></div>
        <p className="not-found-text">
          Don't worry, you can find plenty of other things on our homepage.
        </p>
        <button
          onClick={() => navigate('/')}
          className="home-button"
        >
          Return Home
        </button>
      </div>
    </div>
  )
}

export default NotFound
