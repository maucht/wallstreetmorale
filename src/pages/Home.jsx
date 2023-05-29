import React, { Component } from 'react'
import "../css/main.css"

export default class Home extends Component {
  movePointer = () =>{
    console.log("Move Pointer called")
    const pointer = document.getElementById("pointer")
    //pointer.style.marginLeft = "33px"

  }
  render() {
    
    return (
      <div className = " bg-steelblue h-full w-full absolute top-0 left-0">
        <div className="flex items-center justify-center text-center relative h-full bottom-28 flex-col">
            <h1 className="text-white text-5xl font-mono font-bold pb-12">r/Wallstreetbets mood of the day:</h1>

            <div className="rounded-lg min-h-32 max-h-32 flex flex-col align-bottom pl-12 pr-12">
              <img src="meterv2.png" alt="Mood Meter" className="h-full"/>
            </div>

            <div className='h-48'>
              <img  id = "pointer" src = "pointer.png" alt="Mood Pointer" className="h-1/2"/>
            </div>
        </div>
        {this.movePointer()}
      </div>
    )
    
  }
}

