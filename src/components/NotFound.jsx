import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className='NotFound padding'>
      <h1>Sorry, the page you were looking for was not found.</h1>
      <button className='Notfound-btn'><Link to="/">Return to home</Link></button>
    </div>
  )
}

export default NotFound
