import React from 'react'
import { useOutletContext } from 'react-router-dom'

function Details() {
    const {van} = useOutletContext()
    return (
        <div className='host-van-details'>
            <section className='hostvan-details-desc'>
                <p><strong>Name:</strong> {van.name}</p>
                <p><strong>Category:</strong> {van.type}</p>
                <p><strong>Description:</strong> {van.description}</p>
                <p><strong>Visibility:</strong> Public</p>
            </section>
        </div>
    )
}

export default React.memo(Details)
