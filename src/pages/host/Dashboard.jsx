import React, { useEffect, useState } from 'react'
import Star from "../../images/Star.png"
import { Link, useLoaderData } from "react-router-dom"
import { auth, vanCollection, getHostVans } from '../../Api'
import { FaSpinner } from 'react-icons/fa';
import { doc, deleteDoc, query, where, onSnapshot } from "firebase/firestore";

export async function loader(){
    const userId = localStorage.getItem("userId")
    const data = await getHostVans(userId)
    return data
}

function Dashboard() {
    const loaderData = useLoaderData()
    const userId = localStorage.getItem("userId")
    const [noVans, setNoVans] = useState(false)
    const [vanId, setVanId] = useState("")
    const [loading, setLoading] = useState(true)
    const [vanName, setVanName] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [errorMessage, setErrorMessage] = useState({ message: null })
    const q = query(vanCollection, where("hostId", "==", userId))
    const [vans, setVans] = useState(loaderData)

    function showDeleteModal(name, id) {
        setShowModal(true)
        setVanName(name)
        setVanId(id)
    }

     function deleteVan() {
        setLoading(true)
        deleteDoc(doc(vanCollection, vanId))
        .then(() => {
            setShowModal(false)
        }).catch (error => {
            setLoading(false)
            setErrorMessage({ message: error.message })
            setShowModal(false)
        })
    }


    useEffect(() => {
        setLoading(false)
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setVans(querySnapshot.docs.map((doc) => {
                return {
                    ...doc.data(),
                    id: doc.id
                };
            }));
            if (!querySnapshot) {
                setErrorMessage({ message: "could not fetch vans" })
            }
            setLoading(false)
        });
    }, [vanCollection])


    const displayVans = vans.map(van => {
        return <div key={van.id} className="vans-list">
            <img src={van.imageUrl} alt="van-image" className='vans-list-image' />
            <div className='van-desc'>
                <h2>{van.name}</h2>
                <h3>${van.price}/day</h3>
            </div>
            <div className='edit-actions'>
                <Link to={`edit/${van.id}`} className='edit'><p>Edit</p></Link>
                <p className='delete-van' onClick={() => showDeleteModal(van.name, van.id)}>Delete</p>
            </div>
            <div className='delete-modal padding' style={{ display: showModal ? "block" : "none" }}>
                <p className='delete-question'>Are you sure you want to delete this Van?</p>
                <p className='van-to-delete'>{vanName}</p>
                <div className='delete-option'>
                    <p onClick={deleteVan} className='delete options'>Delete</p>
                    <p onClick={() => setShowModal(false)} className='cancel options'>Cancel</p>
                </div>
                {errorMessage.message && <p className='error-message'>{errorMessage.message}</p>}
            </div>
        </div>
    })

    useEffect(() => {
        if (vans.length < 1 && !errorMessage.message) {
            setNoVans(true)
        } else {
            setNoVans(false)
        }

    }, [vans.length])

    return (
        <div className='dashboard'>
            <div className='dashboard-welcome padding'>
                <h1>Welcome {auth.currentUser?.displayName}!</h1>
                <div className='income-desc'>
                    <h3>Income last <span>30 days</span></h3>
                    <h3>Details</h3>
                </div>
                <h1 className='dashboard-amount'>$2,260</h1>
            </div>
            <div className='dashboard-review padding'>
                <h2>Review score</h2>
                <img src={Star} alt="star-icon" />
                <h2>5.0/<span>5</span></h2>
                <h3>Details</h3>
            </div>
            <div className='your-vans padding'>
                {vans.length > 0 && <h2>Your listed vans</h2>}
                {vans.length > 0 && <p>View all</p>}
            </div>
            {loading && <FaSpinner className='loader' />}
            <div className='vans-list-container'>
                {displayVans}
                {errorMessage.message && <p className='error-message'>{errorMessage.message}</p>}
                {noVans && <div className='no-vans-conatainer'>
                    <h1 className='no-vans'>No vans yet!</h1>
                    <Link to='addVan' className='add-van'>
                        <p>Add Van</p>
                        <i className="fa-solid fa-circle-plus"></i>
                    </Link>
                </div>}
            </div>

        </div>
    )
}

export default React.memo(Dashboard)
