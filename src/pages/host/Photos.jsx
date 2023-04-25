import React from 'react'
import { useOutletContext } from 'react-router-dom'

function Photos() {
    const {van} = useOutletContext()
  return (
    <div>
         <img src={van.imageUrl} alt="van image" className='photos-img' />
    </div>
  )
}

export default React.memo(Photos)
