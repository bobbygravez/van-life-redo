import React, { Suspense } from 'react'
import reviews from "../../images/reviews.jpg"
import { BsStarFill } from "react-icons/bs"
import { FaSpinner } from 'react-icons/fa';
import { defer, useLoaderData, Await } from 'react-router-dom'
import { getHostVans } from '../../Api'

export async function loader() {
    const hostId = localStorage.getItem("userId")
    return defer({ hostVans: getHostVans(hostId) })
}

function Reviews() {
    const loaderData = useLoaderData()

    return (
        <div className='reviews'>
            <div className='review-img-container'>
                <img src={reviews} alt="review image" className='review-img' />
            </div>
            <Suspense fallback={<FaSpinner className='loader' />}>
                <Await resolve={loaderData.hostVans}>
                    {(van) => {
                    const data = van.map(item => {
                        return <div key={item.id}>
                            {item.reviews.map(review => {
                                return <div key={review.commentId}>
                                    <div className="review">
                                        {/* {[...Array(review.rating)].map((_, i) => (
                                            <BsStarFill className="review-star" key={i} />
                                        ))} */}
                                        <div className="info">
                                            <p className="name">{review.name}</p>
                                            <p className="date">{review.date} </p>
                                        </div>
                                        <p className='review-text'>{review.comment}</p>
                                        <small><strong>{review.vanName}</strong></small>
                                    </div>
                                    <hr />
                                </div>
                            })
                            }
                        </div>
                        })

                        return (
                            <div className="review-container">
                                {data}
                            </div>
                        )
                    }}
                </Await>
            </Suspense>
        </div>
    )
}

export default Reviews
