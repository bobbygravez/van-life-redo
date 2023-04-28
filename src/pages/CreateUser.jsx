import React, {useState} from 'react'
import { Link, Form, useActionData, useNavigation, useNavigate, Navigate } from "react-router-dom"
import { createUser, auth } from '../Api'
import { signInWithPopup, GoogleAuthProvider, updateProfile} from "firebase/auth";
import google from "../images/google.png"

export async function action({ request }) {
    const formData = await request.formData()
    const username = formData.get("username")
    const email = formData.get("email")
    const password = formData.get("password")

    try {
        const data = await createUser(auth, email, password)
        await updateProfile(auth.currentUser, {
            displayName: username
        })
        return data
    } catch (error) {
        return { error: error.message }
    }
}

function CreateUser() {
    const [googleError, setGoogleError] = useState({
        message: null
    })
    const data = useActionData()
    const navigation = useNavigation()
    const navigate = useNavigate()
    const provider = new GoogleAuthProvider();

    const from = localStorage.getItem("from") || "/host"

    if (data?.accessToken) {
        return <Navigate to="/login" state={{ message: "Account created, please sign in" }} />
    }

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
            <h1>Create an account</h1>
            {data?.error && <h2 className='error-message'>{data.error}</h2>}
            <Form action="/createUser" method='post' className='form'>
                <input type="text" name='username' placeholder='Username' required autoComplete='off' />
                <input type="email" name='email' placeholder='Email address' required autoComplete='off' />
                <input type="password" name='password' placeholder='Password' required autoComplete='off' />
                <button disabled={navigation.state === "submitting"} className='sign-in'>{navigation.state === "submitting" ? "creating account.." : "create account"}</button>
            </Form>
            <p className='have-an-account'>Already have an account? <Link to='/login'><span>Sign in</span></Link></p>
            <hr />
            <p className='or'>Or</p>
            <div className='google-sign-in' onClick={signInWithGoogle}>
                <p>Sign up with Google</p>
                <img src={google} alt="google icon" className='google-icon' />
            </div>
        </div>
    )
}

export default CreateUser
