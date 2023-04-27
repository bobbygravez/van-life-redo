import React, { useState, useEffect } from 'react'
import { useParams, Link, useLoaderData } from 'react-router-dom'
import { doc, updateDoc } from "firebase/firestore";
import { vanCollection, getHostVan, app } from '../../Api';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export async function loader({ params }) {
    const data = await getHostVan(params.id)
    return data
}

function EditVan() {
    const [uploadProgress, setUploadProgress] = useState("0")
    const [loading, setLoading] = useState(false)
    const [fileName, setFileName] = useState("")
    const [showFileName, setShowFileName] = useState(false)
    const hostId = localStorage.getItem("userId")
    const { id } = useParams()
    const storage = getStorage(app);
    const van = useLoaderData()
    const [displayMessage, setDisplayMessage] = useState({
        success: null,
        error: null
    })
    const [vanData, setVanData] = useState({
        name: van.name,
        price: van.price,
        type: van.type,
        description: van.description,
        imageUrl: van.imageUrl,
        hostId: hostId,
    })

    function handleChange(e) {
        const { name, value } = e.target
        setVanData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    function updateVan(e) {
        e.preventDefault()
        setLoading(true)
        updateDoc(doc(vanCollection, id), {
            name: vanData.name,
            price: vanData.price,
            type: vanData.type,
            description: vanData.description,
            imageUrl: vanData.imageUrl,
            hostId: vanData.hostId
        })
            .then(() => {
                setDisplayMessage({ success: "Van updated!" })
                setLoading(false)
                setUploadProgress("0")
                setShowFileName(false)
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
    }


    function UploadImage(e) {
        const file = e.target.files[0]
        setFileName(file.name)
        setShowFileName(true)
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

    useEffect(() => {
        window.scrollTo(0, 0);
      }, [])

    return (
        <div className='edit-van-container'>
            <Link to=".." className='underline back-to-dashboard'><i className="fa-solid fa-arrow-left"></i> Back to dashboard</Link>
            {displayMessage.error && <h2 className='error-message van-updated'>{displayMessage.error}</h2>}
            {displayMessage.success && <h2 className='success-message van-updated'>{displayMessage.success}</h2>}
            <img src={van.imageUrl} alt="van image" className='host-van-image' />
            <form onSubmit={updateVan}>
                <label htmlFor="van-name" className='label'>Van name:</label>
                <input type="text" name="name" placeholder='Van name' id='van-name' value={vanData.name} onChange={handleChange} required />
                <label htmlFor="van-price" className='label'>Van price($/day):</label>
                <input type="number" name="price" placeholder='Van price' id='van-price' value={vanData.price} onChange={handleChange} required />
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
                    {showFileName && <span style={{color: "blue"}}>{fileName}</span>}
                    <input type="file" id='van-image' onChange={UploadImage} accept='.png, .jpeg, .gif, .jpg'/>
                </label>
                <div className='progress-container'>
                    <div className='progress-bar' style={{ width: `${uploadProgress}%`, padding: uploadProgress > 5 ? "3px" : "0" }}></div>
                    {uploadProgress > 0 && <p style={{ margin: "0" }}>{uploadProgress}%</p>}
                </div>
                <label htmlFor="van-description" className='label'>Van description:</label>
                <textarea name="description" placeholder='Van description' id='van-description' value={vanData.description} onChange={handleChange} required></textarea>
                <button disabled={loading || uploadProgress > 0 && uploadProgress < 99} className='sign-in'>{loading ? "Updating van.." : "Update Van"}</button>
            </form>
        </div>
    )
}

export default EditVan
