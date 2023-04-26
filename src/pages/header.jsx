import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { auth } from "../Api";
import { signOut } from "firebase/auth"

function Header(props) {
  const active = {
      color: "#161616",
      textDecoration: "underline",
      fontWeight: "800"
    }
const loggedIn = localStorage.getItem("loginAccess")
  const navigate = useNavigate()

    function logOut(auth){
      signOut(auth).then(() => {
          navigate("/login")
          localStorage.clear()
        }).catch((error) => {
          console.log(error.messsage)
          return error.message
        })
  }
  
  return (
    <header>
      <h1><Link to="/" className="logo">#VANLIFE</Link></h1>
      <nav className="header-nav">
        <NavLink to="host" style={({isActive}) => isActive ? active : null}>Host</NavLink>
        <NavLink to="about" style={({isActive}) => isActive ? active : null}>About</NavLink>
        <NavLink to="vans" style={({isActive}) => isActive ? active : null}>Vans</NavLink>
        {!loggedIn && <NavLink to="login"><i className="fa-regular fa-user"></i></NavLink>}
        {loggedIn && <p onClick={() => logOut(auth)} className="log-out">logOut</p>}
      </nav>
    </header>
  )
}

export default Header
