import React, { useEffect, useState } from 'react'
import { getVan, vanCollection, auth } from '../../Api'
import { doc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from "firebase/firestore";
import { useLoaderData, useLocation, Link, useParams } from "react-router-dom"
import { FaSpinner } from 'react-icons/fa';
import { nanoid } from 'nanoid';

export async function loader({ params }) {
  const data = await getVan(params.id)
  return data
}

function VansDetail() {
  const loaderData = useLoaderData()
  const date = new Date();
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const formattedDate = formatter.format(date);
  const [van, setVan] = useState(loaderData)
  const [review, setReview] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState({ message: null })
  const location = useLocation()
  const backTo = location.state?.type
  const hostId = localStorage.getItem("userId")
  const { id } = useParams()

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  useEffect(() => {
    setLoading(false)
    const unSub = onSnapshot(doc(vanCollection, id), (doc) => {
      setVan({
        ...doc.data(),
        id: doc.id
      })
      setLoading(false)
    });
  }, [vanCollection])


  function addReview() {
    const reviewData = {
      comment: review,
      name: auth.currentUser.displayName,
      vanName: van.name,
      date: formattedDate,
      commentId: nanoid(),
      ownerId: hostId
    }
    setLoading(true)
    updateDoc(doc(vanCollection, van.id), {
      reviews: arrayUnion(reviewData)
    })
      .then(() => {
        setReview("")
        setLoading(false)
      })
      .catch(err => {
        setError({ message: err.message })
        console.log(err.message)
        setLoading(false)
      })

  }

  function deleteComment(comment) {
    updateDoc(doc(vanCollection, id), {
      reviews: arrayRemove(comment)
    })
      .then(() => {})
      .catch(err => {console.log(err.message)})
  }

  const reviewsArray = van.reviews.map((review, i) => {
    return <div key={review.commentId}>
      <div className='info'>
        <p className='review-name'>{review.name}</p>
        <p className='review-date'>{review.date}</p>
        {hostId === review.ownerId && <i className="fa-solid fa-trash" onClick={() => deleteComment(review)}></i>}
      </div>
      <p className='van-review-text'>{review.comment}</p>
      <hr />
    </div>
  })

  return (
    <div className='van-detail-page padding'>
      <Link to={location.state.van ? `..${backTo}` : ".."} relative="path"><i className="fa-solid fa-arrow-left"></i> Back to {location.state.van ? location.state.van : "all"} vans</Link>
      <div className='chosen-van'>
        <div className='grid'>
          <div className='van-details-size'>
            <img src={van.imageUrl} alt="van-image" className='van-image' />
            <p className={`van-type ${van.type === "simple" ? "simple" : van.type === "rugged" ? "rugged" : "luxury"}`}>{van.type}</p>
            <h1>{van.name}</h1>
            <h2>${van.price}/<span>day</span></h2>
            <p>{van.description}</p>
          </div>
          <div className='van-review-container'>
            <h1 className='review-header'>Reviews</h1>
            {reviewsArray}
            {loading && <FaSpinner className='loader2' />}
          </div>
          <div className='rent-and-review'>
            <button className='rent-van'>Rent this van</button>
            {auth.currentUser && <div className='review-input'>
              <textarea name="review" placeholder='Leave a review' onChange={(e) => setReview(e.target.value)} value={review} ></textarea>
              <button disabled={hostId === van.hostId} className='post-comment' onClick={addReview}>{loading ? "Posting...." : "Post review"}</button>
            </div>}
        </div>
      </div>
      </div>
    </div >
  )
}

export default VansDetail
