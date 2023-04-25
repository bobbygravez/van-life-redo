import React from 'react'
import { useRouteError } from 'react-router-dom'

function Error() {
    const error = useRouteError()
  return (
    <div className='padding'>
      <h1>error: {error.message}</h1>
    </div>
  )
}

export default Error
