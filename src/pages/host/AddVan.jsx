import React, { useState } from 'react'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc } from "firebase/firestore";
import { vanCollection, app, auth } from '../../Api';


function AddVan() {
    const [uploadProgress, setUploadProgress] = useState("0")
    const [loading, setLoading] = useState(false)
    const hostId = localStorage.getItem("userId")
    const [fileName, setFileName] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [displayMessage, setDisplayMessage] = useState({
        success: null,
        error: null
    })
    const [vanData, setVanData] = useState({
        name: "",
        price: "",
        type: "",
        description: "",
        imageUrl: "",
        hostId: hostId,
    })

    const storage = getStorage(app);

    function handleChange(e) {
        const { name, value } = e.target
        setVanData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    function addVan(e) {
        e.preventDefault()
        if (auth.currentUser.emailVerified) {
            setLoading(true)
            addDoc(vanCollection, {
                name: vanData.name,
                price: vanData.price,
                type: vanData.type,
                description: vanData.description,
                imageUrl: vanData.imageUrl,
                reviews: [],
                hostId: vanData.hostId
            })
                .then(() => {
                    setDisplayMessage({ success: "Van added!" })
                    setLoading(false)
                    setVanData({
                        name: "",
                        price: "",
                        type: "",
                        description: "",
                        imageUrl: "",
                        hostId: hostId,
                    })
                    setUploadProgress("0")
                    setTimeout(() => {
                        setDisplayMessage({ success: null })
                    }, 2000)
                }).catch(err => {
                    setDisplayMessage({ error: err.message })
                    setLoading(false)
                    setTimeout(() => {
                        setDisplayMessage({ error: null })
                    }, 3000)
                })
        } else {
            setShowModal(true)
        }
    }

    function UploadImage(e) {
        const file = e.target.files[0]
        setFileName(file.name)
        const vansRef = ref(storage, `vans/${file.name}`);
        const uploadTask = uploadBytesResumable(vansRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress.toFixed(0))
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        // console.log('Upload is paused');
                        break;
                    case 'running':
                        // console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                // Handle unsuccessful uploads
                setDisplayMessage({ error: error.message })
            },
            () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setVanData(prevData => ({
                        ...prevData,
                        imageUrl: downloadURL
                    }))
                });
            }
        );
    }

    return (
        <div className='padding add-van-container'>
            {displayMessage.error && <h2 className='error-message van-added'>{displayMessage.error}</h2>}
            {displayMessage.success && <h2 className='success-message van-added'>{displayMessage.success}</h2>}
            {showModal && <div className='email-modal'>
                <i className="fa-solid fa-xmark" onClick={() => setShowModal(false)}></i>
                <p>You need to verify your email before you can add a van.</p>
                <p>click the link we sent to your mail to verify your address.</p>
            </div>}
            <form onSubmit={addVan}>
                <input type="text" name="name" placeholder='Van name' value={vanData.name} onChange={handleChange} required />
                <input type="number" name="price" placeholder='Van price($/day)' value={vanData.price} onChange={handleChange} required />
                <label htmlFor="van-type" className='label'>Van type:</label>
                <select name="type" id='van-type' value={vanData.type} onChange={handleChange} required>
                    <option value=""></option>
                    <option value="simple">simple</option>
                    <option value="luxury">luxury</option>
                    <option value="rugged">rugged</option>
                </select>
                <p className='upload-image'>Upload van image</p> 
                <label htmlFor="van-image" className='van-image-label'>
                    <span>Select file:</span>
                    <span>{fileName}</span>
                    <input type="file" id='van-image' onChange={UploadImage} accept='.png, .jpeg, .gif, .jpg' required />
                </label>

                <div className='progress-container'>
                    <div className='progress-bar' style={{ width: `${uploadProgress}%`, padding: uploadProgress > 5 ? "3px" : "0" }}></div>
                    {uploadProgress > 0 && <p style={{ margin: "0" }}>{uploadProgress}%</p>}
                </div>
                <textarea name="description" placeholder='Van description' value={vanData.description} onChange={handleChange} required></textarea>
                <button disabled={loading || uploadProgress < 100} className='sign-in'>{loading ? "Adding van.." : "Add Van"}</button>
            </form>
        </div>
    )
}

export default AddVan
