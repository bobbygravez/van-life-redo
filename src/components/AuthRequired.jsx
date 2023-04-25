import React from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'

function AuthRequired() {
    const location = useLocation()
    const loginStatus = localStorage.getItem("loginAccess")
    if(!loginStatus){
        return <Navigate to="/login" state={{ message: "You must log in first.", from: location.pathname}} replace />
    }

  return <Outlet />
}

export default AuthRequired
