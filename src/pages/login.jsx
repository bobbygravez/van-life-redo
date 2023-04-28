import React, { useEffect, useState } from 'react'
import { loginUser, auth } from "../Api"
import { Form, useActionData, useNavigate, useNavigation, useLocation, Link } from 'react-router-dom'
import { signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import google from "../images/google.png"

export async function action({ request }) {
    const formData = await request.formData()
    const email = formData.get("email")
    const password = formData.get("password")

    try {
        const data = await loginUser(auth, email, password)
        localStorage.setItem("loginAccess", data.accessToken)
        localStorage.setItem("authenticatedWithEmail", true)
        return data
    } catch (error) {
        return { error: error.message }
    }
}

function Login() {
    const [googleError, setGoogleError] = useState({
        message: null
    })
    const location = useLocation()
    const navigation = useNavigation()
    const data = useActionData()
    const navigate = useNavigate()
    const provider = new GoogleAuthProvider();
    const loginStatus = localStorage.getItem("loginAccess")
    if (!loginStatus && location.state?.from) {
        localStorage.setItem("from", location.state?.from)
    }

    const from = localStorage.getItem("from") || "/host"

    useEffect(() => {
        if (data?.accessToken) {
            navigate(from, { replace: true })
        }
    }, [data])

    function signInWithGoogle() {
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                console.log(user)
                localStorage.setItem("loginAccess", user.accessToken)
                // IdP data available using getAdditionalUserInfo(result)
                // ...
                navigate(from, { replace: true })
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                setGoogleError({message: errorMessage})
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
    }

    return (
        <div className='login-page padding'>
            <h1>Sign into your account</h1>
            {location.state?.message && <h2 className='login-first'>{location.state.message}</h2>}
            {data?.error && <h2 className='error-message'>{data.error}</h2>}
            {googleError.error && <h2 className='error-message'>{googleError.error}</h2>}
            <Form action="/login" method='post' className='form'>
                <input type="email" name='email' placeholder='Email address' autoComplete='off' />
                <input type="password" name='password' placeholder='Password' autoComplete='off' />
                <Link to='/forgotPassword' className='forgot-password'>Forgot Password?</Link>
                <button disabled={navigation.state === "submitting"} className='sign-in'>{navigation.state === "submitting" ? "Signing in...." : "Sign in"}</button>
            </Form>
            <p className='have-an-account'>Don't have an account? <Link to="/createUser"><span>Create one now</span></Link></p>
            <hr />
            <p className='or'>Or</p>
            <div className='google-sign-in' onClick={signInWithGoogle}>
                <p>Sign in with Google</p>
                <img src={google} alt="google icon" className='google-icon' />
            </div>
        </div>
    )
}

export default Login
