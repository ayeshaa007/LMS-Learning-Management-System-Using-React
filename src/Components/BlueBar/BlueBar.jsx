import React from 'react'
import './BlueBar.css'
import { Link } from 'react-router-dom'

const BlueBar = () => {
  return (
    <div className='blueBar'>
        <p>Start learning today</p>
        <Link to='signup'><button>Sign up free</button></Link>
    </div>
  )
}

export default BlueBar