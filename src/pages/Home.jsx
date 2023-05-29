import React, { Component, createRef } from 'react'
import axios from 'axios'
import "../css/main.css"

export default class Home extends Component {
  state = {
    rate: 0.0 // 0.0 = midpoint, -1.0 leftmost, 1.0 rightmost
  }
  

  meter = createRef()
  pointer = createRef()

  componentDidMount(){
    this.movePointer()
    this.setRate()
  }
  setRate = () =>{
    // axios
    //axios.defaults.baseURL = "http://localhost:8000/"
    let instance = axios.create({
      baseURL: "http://127.0.0.1:8000/"
    })


    let fetchedStats = null
    instance.get("api/dailystats").then(response =>
      console.log(response)
    )
    
  }
  movePointer = () =>{
    console.log("Move Pointer called")
    const pointer = this.pointer.current
    const meter = this.meter.current
    if(pointer && meter){
      const meterImage = meter.querySelector("img")
      meterImage.addEventListener('load', () => {
        const meterWidth = meterImage.offsetWidth
        console.log("Mood Meter width:", meterWidth);
        // if rate is 98%, set marginleft to 98% * meterWidth

        console.log("ADJUSTING: " + ((this.state.rate) * (meterWidth)).toString())
        pointer.style.marginLeft = (((this.state.rate) * (meterWidth))).toString() + "px"
      });
    }


  }
  render() {
    
    return (
      <div className = " bg-steelblue h-full w-full absolute top-0 left-0">
        <div className="flex items-center justify-center text-center relative h-full bottom-28 flex-col">
            <h1 className="text-white text-5xl font-mono font-bold pb-12">r/Wallstreetbets mood of the day:</h1>

            <div className="rounded-lg min-h-32 max-h-32 flex flex-col align-bottom pl-12 pr-12" ref={this.meter}>
              <img src="meterv2.png" alt="Mood Meter" className="h-full"/>
            </div>

            <div className='h-48' ref = {this.pointer}>
              <img src = "pointerv2.png" alt="Mood Pointer" className="h-1/4"/>
            </div>
        </div>
        {this.movePointer()}
      </div>
    )
    
  }
}

