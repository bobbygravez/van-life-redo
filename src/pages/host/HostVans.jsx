import React, { Suspense, useEffect } from 'react'
import { useLoaderData, defer, Await, Link } from 'react-router-dom'
import { getHostVans } from '../../Api'
import { FaSpinner } from 'react-icons/fa';

export async function loader() {
  const userId = localStorage.getItem("userId")
  return defer({ vans: getHostVans(userId) })
}

function HostVans() {
  const loaderData = useLoaderData()

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  
  return (
    <div className='host-vans'>
      <Suspense fallback={<FaSpinner className='loader' />}>
        <Await resolve={loaderData.vans}>
          {vans => {
            const displayVans = vans.map(van => {
              return <Link to={van.id} key={van.id} className='host-list-container'>
                <div className="host-list">
                  <img src={van.imageUrl} alt="van-image" className='vans-list-image' />
                  <div className='van-desc'>
                    <h2>{van.name}</h2>
                    <h3>${van.price}/day</h3>
                  </div>
                </div>
              </Link>
            })

            return (
              <div>
                {displayVans.length > 0 && <h1>Your listed vans</h1>}
                <div className='host-vans-list'>
                    {displayVans}
                </div>
                {displayVans.length < 1 && <h1 className='no-vans'>No vans yet!</h1>}
              </div>
            )
          }}
        </Await>
      </Suspense>
    </div>
  )
}

export default React.memo(HostVans)
