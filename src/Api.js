
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, getDoc, doc, query, where } from "firebase/firestore"
import {
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword
} from "firebase/auth"


const firebaseConfig = {
  apiKey: import.meta.env.API_KEY,
  authDomain: "new-vanlife.firebaseapp.com",
  projectId: "new-vanlife",
  storageBucket: "new-vanlife.appspot.com",
  messagingSenderId: "602266797345",
  appId: "1:602266797345:web:26700528a5c2732c9a6a60"
};

export const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
export const auth = getAuth()

export const vanCollection = collection(db,"vans")

export async function getVans() {
   const snapshot = await getDocs(vanCollection)
   const data = snapshot.docs.map(doc => {
        return {
            ...doc.data(),
            id: doc.id
        }
   })

    if (!snapshot) {
        throw {
            message: "Failed to fetch vans",
            statusText: res.statusText,
            status: res.status
        }
    }

    return data
}

export async function getVan(id) {
    const snapshot = await getDoc(doc(db, "vans", id))
    const data = {
        ...snapshot.data(),
        id: snapshot.id
    }
     if (!snapshot) {
         throw {
             message: "Failed to fetch vans",
             statusText: res.statusText,
             status: res.status
         }
     }
 
     return data
 }

export async function getHostVans(id) {
    const q = query(vanCollection, where("hostId", "==", id))
    const snapshot = await getDocs(q)
    const data = snapshot.docs.map(doc => {
        return {
            ...doc.data(),
            id: doc.id
        }
   })
    if (!snapshot) {
        throw {
            message: "Failed to fetch vans",
            statusText: res.statusText,
            status: res.status
        }
    }

    return data
}

export async function getHostVan(id) {
    const snapshot = await getDoc(doc(db, "vans", id))
    const data = {
        ...snapshot.data(),
        id: snapshot.id
    }
     
    if (!snapshot) {
        throw {
            message: "Failed to fetch vans",
            statusText: res.statusText,
            status: res.status
        }
    }

    return data
}



export async function loginUser(auth, email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)

    if (!userCredential) {
        throw {
            message: data.message,
            statusText: res.statusText,
            status: res.status
        }
    }

    return userCredential.user
}

export async function createUser(auth, email, password) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    console.log(userCredential.user)

    if (!userCredential) {
        throw {
            message: data.message,
            statusText: res.statusText,
            status: res.status
        }
    }

    return userCredential.user
}
