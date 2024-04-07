import React, { Suspense } from 'react'
import { getHostVan } from '../../Api'
import { defer, Await, useLoaderData, Outlet, Link, NavLink } from "react-router-dom"
import { FaSpinner } from 'react-icons/fa';
import HostVanNav from './hostVanNav';

export async function loader({ params }) {
    return defer({ hostVan: getHostVan(params.id) })
}

function HostVanDetail() {
    const loaderData = useLoaderData()
    return (
        <div className='padding hostVanDetail'>
            <Link to=".." relative="path" className='underline'><i className="fa-solid fa-arrow-left"></i> Back to all vans</Link>
            <section className='padding host-container'>
                <Suspense fallback={<FaSpinner className='loader' />}>
                    <Await resolve={loaderData.hostVan}>
                        {(van) => {
                    return <section key={van.id}>
                                <div  className='hostVanDetail-container'>
                                    <img src={van.imageUrl} alt="van-image" className='host-van-img' />
                                    <div>
                                        <p className='hostvan-type'>{van.type}</p>
                                        <h1 className='hostvan-name'>{van.name}</h1>
                                        <h3 className='hostvan-price'>${van.price}<span>/day</span></h3>
                                    </div>
                                </div>
                                <HostVanNav />
                                <Outlet context={{van}} />
                            </section>
                        }}
                    </Await>
                </Suspense>
            </section>

        </div>
    )
}

export default React.memo(HostVanDetail)
