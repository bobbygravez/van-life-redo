import React, { Suspense } from 'react'
import { useLoaderData, defer, Await, useSearchParams, Link } from 'react-router-dom'
import { getVans } from '../../Api'
import { FaSpinner } from 'react-icons/fa';

export async function loader() {
  return defer({ vans: getVans() })
}

function Vans() {
  const [searchParams, setSearchParams] = useSearchParams()
  const typeFilter = searchParams.get("type")
  const loaderData = useLoaderData()

  function handleSearchParams(key, value) {
    setSearchParams(prevParams => {
      if (value === null) {
        prevParams.delete(key)
      } else {
        prevParams.set(key, value)
      }

      return prevParams
    })
  }


  return (
    <div className='vans padding'>
      <h1>Explore our van options</h1>
      <div className='filters'>
        <button className='simple-filter' onClick={() => handleSearchParams("type", "simple")}>Simple</button>
        <button className='luxury-filter' onClick={() => handleSearchParams("type", "luxury")}>Luxury</button>
        <button className='rugged-filter' onClick={() => handleSearchParams("type", "rugged")}>Rugged</button>
        <p onClick={() => handleSearchParams("type", null)}>Clear filters</p>
      </div>
      <Suspense fallback={<FaSpinner className='loader' />}>
        <Await resolve={loaderData.vans}>
          {(vans) => {
            const displayedVans = typeFilter ? vans.filter(item => item.type === typeFilter) : vans
            const van = displayedVans.map(item => {
              return <div key={item.id} className="van">
                <Link to={item.id} state={{ type: `?type=${item.type}`, van: typeFilter }}>
                  <div className='van-image-containter'>
                    <img src={item.imageUrl} alt="van image" className='van-image' />
                  </div>
                  <div className='van-details'>
                    <h2>{item.name}</h2>
                    <h2>${item.price}/<span>day</span></h2>
                  </div>
                  <p className={`van-type ${item.type === "simple" ? "simple" : item.type === "rugged" ? "rugged" : "luxury"}`}>{item.type}</p>
                </Link>
              </div>
            })

            return (
              <div className='vans-container'>
                {van}
              </div>
            )
          }
          }
        </Await>
      </Suspense>
    </div>
  )
}

export default Vans
