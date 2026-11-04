import React from 'react'
import './Linebar.css'
const Linebar = () => {
     const bar=[
{id:1,t:"10K+",b:"Students"},
{id:2,t:"200+",b:"Courses"},
{id:3,t:"50+",b:"Mentors"},
{id:4,t:"4.8",b:"Avg rating"}
    ];
  return (
    <div className='linebar'>
{bar.map((item)=>(
<div className="barlist" key={item.id}>
<h3>{item.t}</h3>
<p>{item.b}</p>
</div>
))}
    </div>
  )
}

export default Linebar