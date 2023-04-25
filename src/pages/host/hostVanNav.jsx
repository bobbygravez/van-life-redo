import React from 'react'
import { NavLink } from 'react-router-dom'

function HostVanNav() {
    return (
        <nav className='hostVan-nav'>
            <NavLink to="." end state={(isActive) => isActive ? "isActive" : ""}>Details</NavLink>
            <NavLink to="pricing" state={(isActive) => isActive ? "isActive" : ""}>Pricing</NavLink>
            <NavLink to="photos" state={(isActive) => isActive ? "isActive" : ""}>Photos</NavLink>
        </nav>
    )
}

export default HostVanNav
