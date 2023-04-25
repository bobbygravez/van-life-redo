import React, {Suspense} from 'react'
import { useOutletContext} from 'react-router-dom'

function Pricing() {
    const {van} = useOutletContext()

  return (
    <div>
       <h2>${van.price} <span>/day</span></h2>
    </div>
  )
}

export default React.memo(Pricing)
