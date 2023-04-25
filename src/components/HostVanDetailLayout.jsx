import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import HostVanDetail from '../pages/host/HostVanDetail'

function HostVanDetailLayout() {
    return (
        <div>
            <HostVanDetail />
            <nav className='hostVan-nav'>
                <NavLink to="." end state={(isActive) => isActive ? "isActive" : ""}>Details</NavLink>
                <NavLink to="pricing" state={(isActive) => isActive ? "isActive" : ""}>Pricing</NavLink>
                <NavLink to="photos" state={(isActive) => isActive ? "isActive" : ""}>Photos</NavLink>
            </nav>

            <Outlet />
        </div>
    )
}

export default HostVanDetailLayout
