import React from 'react'
import './HeroSection.css'
import hero from '../../assets/hero.jpg'
import { Link } from 'react-router-dom'
const HeroSection = () => {
  return (
    <div className='heroSection'>
        <div className="left">
<h2>Learn new skills from expert instructors</h2>
<p>Courses in web development, design and data — build real projects and earn certificates.</p>
<div className="btns">
<Link to='/login'><button>Get started</button></Link>
<Link to='/courses'><button>Browse courses</button></Link>
</div>
        </div>
        <div className="right">
<img src={hero}/>
        </div>
    </div>
  )
}

export default HeroSection