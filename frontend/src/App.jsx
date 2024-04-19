
import { useEffect, useState } from 'react'
import './App.css'
import Button from './Button'
import Text from './Text'
import Badge from './Badge'

function App() {
  const [input,setInput]=useState("")
  const [length,setLength]=useState(3)
  const [output,setOutput]=useState(null)
  const [keywords,setkeywords]=useState([])


    const handleChange = (event) => {
    setInput(event.target.value);
    
  };

  const resetInput=()=>{
    setInput("")
    setLength(3)
    setOutput(null)
    setkeywords([])
  }

  const handleLengthChange=(e)=>{
    setLength(e.target.value)
  }

  const sendData=()=>{
    fetch("http://localhost:8000/api",{
      method:'post',
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({input:input,length:length})
    }).then(response=>response.json()).then(data=>{
      
      console.log(data.output)
      

      console.log((JSON.parse(data.output)).summary)
      setOutput((JSON.parse(data.output)).summary)
      setkeywords((JSON.parse(data.output)).keywords)

    })

    console.log("clicked")


  }
  useEffect(()=>{
    console.log(`input => ${input} and length=> ${length}` )

  },[length,input,output])





  return (
    <>
    <div className="navbar bg-purple-900 rounded-xl  inline-block font-mono  ">
  <button className="btn btn-ghost text-xl float-left font-bold text-white">Qwick Summarify</button>
  <select className="select select-bordered w-full max-w-xs float-right" onChange={handleLengthChange}>
  <option disabled selected>Summary lengh</option>
  <option className='font-semibold' value="3">3 lines</option>
  <option className='font-semibold' value="5">5 lines</option>
  <option className='font-semibold' value="7">7 lines</option>
</select>
</div>

{/* text area*/}
<div className='grid grid-cols-2 gap-2 m-5 '>


  <div className='flex justify-center'>
    <textarea className={`textarea textarea-secondary h-[500px] w-[700px] placeholder:opacity-50 text-xl font-mono `} placeholder="Enter the text to summarize..."value={input} onChange={handleChange}></textarea>
  </div>


  <div className='flex flex-col justify-center' >
    <textarea  className={`text-lg textarea textarea-secondary h-[500px] w-[700px] overflow-auto resize-none  font-mono `}placeholder={output? output :  "Result will be displayed here..."}></textarea>
  </div>
  
</div>

<div className='flex gap-4 justify-center'>
  {
  !(keywords.length===0)? <div className='text-lg font-mono '>Keywords :  </div> : <div></div>
}
    {
    keywords.map((ele,index)=>{
        return <Badge key={index} ele={ele} ></Badge>
    })
  }
  </div>

{/* footer area*/}
<div className='flex justify-center gap-5 mt-10' >
<Button name="Generate" action={sendData}></Button>
<Button name="Reset" action={resetInput}></Button>
</div>

    </>
  )
}

export default App
