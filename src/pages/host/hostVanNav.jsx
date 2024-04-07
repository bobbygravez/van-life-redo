import React from 'react'
import { NavLink } from 'react-router-dom'

function HostVanNav() {
    const active = {
        textDecoration: "underline",
        fontWeight: "700"
    }
    
    return (
        <nav className='hostVan-nav'>
        <NavLink to="." end style={({isActive}) => isActive? active : null}>Details</NavLink>
        <NavLink to="pricing" style={({isActive}) => isActive? active : null}>Pricing</NavLink>
        <NavLink to="photos" style={({isActive}) => isActive? active : null}>Photos</NavLink>
        </nav>
    )
}

export default HostVanNav
