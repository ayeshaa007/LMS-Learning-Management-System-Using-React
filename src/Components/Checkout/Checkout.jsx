import React, { useContext, useState } from 'react'
import './Checkout.css'
import { useNavigate } from 'react-router-dom'
import { CourseContext } from '../../Context/CourseContext'
import Navbar from '../Navbar/Navbar'

const Checkout = () => {
  const { courses, viewingCourseIndex, enrollStudent } = useContext(CourseContext);
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");

  const course = viewingCourseIndex !== null ? courses[viewingCourseIndex] : null;

  const handlePay = () => {
    if (viewingCourseIndex === null) {
      alert("No course selected.");
      return;
    }
    if (enrollStudent(viewingCourseIndex)) {
      navigate("/courseplayer");
    }                  
  };

  if (!course) {
    return (
      <>
        <Navbar />
        <div className='checkout'>
          <p>No course selected. Please go back to the course catalog and pick a course.</p>
        </div>
      </>
    );
  }

  const isPaid = course.pricing.price === "paid";
  const price = isPaid ? parseFloat(course.pricing.dollars) || 0 : 0;

  return (
    <>
    <Navbar />
    <div className='checkout'>
      <div className="left">
        <h4>Order summary</h4>
        <div className="nameRow">
          <p>{course.basics.title}</p>
          <span>${price.toFixed(2)}</span>
        </div>
        <label> Coupon code</label>
        <input type="text" placeholder='Enter coupon code' value={coupon} onChange={(e) => setCoupon(e.target.value)} />
        <div className="total">
          <p>Total:</p>
          <span>${price.toFixed(2)}</span>
        </div>
      </div>

      <div className="right">
        <h4>Payment details</h4>
        <label>Card number</label>
        <input type="text" placeholder='1234 5678 9101 1123' />
        <div className="date">
          <label>Expiry</label>
          <label>CVC</label>
          <input type="date" />
          <input type="text" placeholder='123' />
        </div>
        <button onClick={handlePay}>{price === 0 ? "Enroll for free" : "Pay now"}</button>
      </div>
    </div>
    </>
  )
}

export default Checkout
