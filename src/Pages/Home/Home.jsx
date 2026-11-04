import React from 'react'

import HeroSection from '../../Components/HeroSection/HeroSection'
import Linebar from '../../Components/Linebar/Linebar'
import FeaturedCourses from '../../Components/FeaturedCourses/FeaturedCourses'
import BlueBar from '../../Components/BlueBar/BlueBar'
import Footer from '../../Components/Footer/Footer'
import Navbar from '../../Components/Navbar/Navbar'

const Home = () => {
  return (
    <div className='home'>
        <Navbar/>
      <HeroSection/>
      <Linebar/>
      <FeaturedCourses/>
      <BlueBar/>
      <Footer/>
    </div>
  )
}

export default Home