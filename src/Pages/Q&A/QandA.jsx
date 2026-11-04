import React, { useState } from 'react'
import './QandA.css'
import Navbar from '../../Components/Navbar/Navbar';
const QandA = () => {
 const  qa=[
{id:1,q:"Why is useEffect running twice in dev mode?",d:"Asked in React for beginners ",a:["Lorem ipsum dolor sit amet.", "o create custom control buttons (e.g., a custom Play/Pause button)"," instead of using the browser's default overlay,"],l:["React","Hooks"]},
{id:2,q:"Best way to structure a Flask project?",d:"Asked in Python data analysis",a:["Lorem ipsum dolor sit amet."],l:["Python","Flask"]},
{id:3,q:"How to center a div — best modern approach?",d:"How to center a div — best modern approach?",a:["Lorem ipsum dolor sit amet.", "o create custom control buttons (e.g., a custom Play/Pause button)"," instead of using the browser's default overlay,","Asked in React for beginners "],l:["CSS"]},
      ];



      const [clickId, setClickId]=useState(null);

      const aClick=(itemId)=>{
        setClickId(itemId)
      }

      const [searchVal, setSearchVal] = useState("");
const [qaList, setQaList] = useState(qa);

const handleSearch = () => {
  setClickId(null);
  if (searchVal.trim() === "") {
    setQaList(qa); 
    return;
  }
  const filterList = qa.filter((item) => 
    item.q.toLowerCase().includes(searchVal.toLowerCase())
  ); 
  setQaList(filterList);
};


  return (
    
    <div className='qAndA'>
      <Navbar/>
     <div className="search">
      <input type="text" placeholder='Search questions...' onChange={e=>setSearchVal(e.target.value)}/>
      <button onClick={handleSearch}>Search</button>
      </div>
<div className="qList">
 {qaList.map((item)=>( <div className="qItem" key={item.id}>
<h4>{item.q}</h4>
<p>{item.d} — <span onClick={()=>(aClick(item.id))}>{item.a.length} answers</span></p>

{clickId==item.id ? <div className="alist">
  <h4>Answers.....</h4>
{item.a.map((i, index) => (
  <p key={index}><b>{index+1}: </b>{i}</p>
))}
<div className="answer">
  <textarea placeholder='Write your answer..'/>
  <button>Post</button>
</div>
</div> : null}

<div className="lang">
  {item.l.map((i, index) => (
  <span key={index}>{i}</span>
))}
  
</div>
  </div>))}
</div>
    </div>
  )
}

export default QandA