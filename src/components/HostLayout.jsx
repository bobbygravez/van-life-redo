import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'

function HostLayout() {
  const active = {
      textDecoration: "underline",
      fontWeight: "700"
  }
  return (
    <div className='host'>
      <nav className='host-nav'>
        <NavLink end to="." style={({isActive}) => isActive? active : null}>Dashboard</NavLink>
        <NavLink to="income" style={({isActive}) => isActive? active : null}>Income</NavLink>
        <NavLink to="vans" style={({isActive}) => isActive? active : null}>Vans</NavLink>
        <NavLink to="reviews" style={({isActive}) => isActive? active : null}>Reviews</NavLink>
        <NavLink to="addVan" style={({isActive}) => isActive? active : null}>Add van</NavLink>
      </nav>
      <Outlet />
    </div>
  )
}

export default HostLayout
