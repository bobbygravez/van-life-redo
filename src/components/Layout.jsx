import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../pages/header'
import Footer from '../pages/footer'
import { onAuthStateChanged, sendEmailVerification, getAuth } from "firebase/auth";

function Layout() {
  const [showModal, setShowModal] = useState(false)
  const auth = getAuth()

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      localStorage.setItem("userId", uid)
      setShowModal(true)

      let emailAuth = localStorage.getItem("authenticatedWithEmail")
      if (emailAuth) {
        if (!user.emailVerified) {
          if (localStorage.getItem("verificationMailSent")) {
            console.log("verificaton mail already sent")
          } else {
            sendEmailVerification(user)
              .then(() => {
                localStorage.setItem("verificationMailSent", true)
                console.log("sent verification mail, check your email")
              })
          }
        }
      }

    } else {
      setShowModal(false)

    }
  });
  return (
    <div className='layout'>
      <Header />
      <main>
        <Outlet />
      </main>
      {showModal
        && <small className='verify-mail' style={{display: auth.currentUser?.emailVerified === false ? "block" : "none"}}>please verify your email through the link we sent to your mail</small>}
      <Footer />
    </div>
  )
}

export default Layout
