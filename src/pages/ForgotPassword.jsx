import React from 'react'
import { Form, useActionData, useNavigate, useNavigation, useLocation, Link} from 'react-router-dom'
import { auth } from '../Api'
import {sendPasswordResetEmail} from "firebase/auth"

export async function action ({request}){
    const formData = await request.formData()
    const email = formData.get("email")

    try {
        await sendPasswordResetEmail(auth, email)
        return  {success: "please check your email and reset your password"}
    } catch (error) {
        console.log(error.message)
        return {error: error.message}  
    }
}

function ForgotPassword() {
    const data = useActionData()
    const navigation = useNavigation()
  return (
    <div className='login-page padding'>
        <h2>Input the email address associated with your account</h2>
        {data?.error && <h2 className='error-message'>{data.error}</h2>}
        {data?.success && <h3 className='success-message'>{data.success}</h3>}
        <Form action='/forgotPassword' method='post' className='form'>
            <input type="email" name='email' placeholder='Email address'/>
            <button disabled={navigation.state === "submitting"} className='sign-in'>{navigation.state === "submitting"? "Sending link.." : "Reset password"}</button>
        </Form>
    </div>
  )
}

export default ForgotPassword
