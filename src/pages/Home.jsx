import React, { Component, createRef } from 'react';
import axios from 'axios';
import '../css/main.css';

export default class Home extends Component {
  state = {
    rate: null, // 0.0 = midpoint, -1.0 leftmost, 1.0 rightmost
    posStat: null,
    negStat: null,
    statsLoaded: false,
    pointerMoved: false,
  };

  meter = createRef()
  pointer = createRef()

  componentDidMount() {
    if (!this.state.statsLoaded) {
      this.setRate()
      document.title = "WallStreetMorale"
    }
    if (!this.state.pointerMoved) {
      this.movePointer()
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (!prevState.statsLoaded && this.state.statsLoaded && !this.state.pointerMoved) {
      this.movePointer();
    }
  }

  setRate = () => {


    let instance = axios.create({ // access rest api
      baseURL: 'https://wsmapi.onrender.com/',
    });
    /* EXPERIMENTAL START
    instance.get('execute-script').then(response=>{
      console.log(response.data["output"]["today"]) // working
    })
    */ 
    instance.get('execute-script').then(response => {

      const posStat = Number(response.data["output"]["today"]["positive"])
      const negStat = Number(response.data["output"]["today"]["negative"])

      const prevPosStat = Number(response.data["output"]["yesterday"]["positive"])
      const prevNegStat = Number(response.data["output"]["yesterday"]["negative"])

      this.setState({
        posStat,
        negStat,
        prevPosStat,
        prevNegStat
      }, () => {
        const rate = -1 + 2 * (this.state.posStat / (this.state.posStat + this.state.negStat));
        const prevRate = -1 + 2 * (this.state.prevPosStat / (this.state.prevPosStat + this.state.prevNegStat));
        console.log("PREV RATE:",prevRate)
        this.setState({
          rate: rate,
          prevRate,
          statsLoaded: true,
        }, ()=>{
          this.movePointer()
        })
      }
      );
      
    });
    this.movePointer() // testing this to speed things up. remove if needed.
  };

  movePointer = () => {
    if (this.state.statsLoaded) {
      console.log('Move Pointer called');
      console.log("Positive:",this.state.posStat)
      console.log("Negative:",this.state.negStat)
      

      const pointer = this.pointer.current
      const meter = this.meter.current

      if (pointer && meter) {
        const meterWidth = meter.offsetWidth
        const calculatedMovement = this.state.rate * meterWidth
        console.log('Mood Meter width:', meterWidth)
        console.log('Rate:', this.state.rate)
        
        if(calculatedMovement >= 0){
          pointer.style.marginRight = "0px"
          pointer.style.marginLeft = `${calculatedMovement}px`
        }
        else{
          pointer.style.marginLeft = "0px"
          pointer.style.marginRight = `${-calculatedMovement}px`
        }
        
      }

      this.setState({
        pointerMoved: true,
      });
    }
  };
  categorizeRate = () =>{
    if(this.state.rate === 1.0){
      return "Perfect"
    }
    else if(this.state.rate >= 0.5){
      return "Very Good"
    }
    else if(this.state.rate > 0.0){
      return "Good"
    }
    else if(this.state.rate === 0.0){
      return "Neutral"
    }
    else if(this.state.rate >= -0.5){
      return "Bad"
    }
    else if(this.state.rate > -1.0){
      return "Very Bad"
    }
    else if(this.state.rate === -1.0){
      return "Terrible"
    }
    else{ // this shouldn't happen
      return "Neutral"
    }
  }

  render() {
    if(this.state.statsLoaded){
    return (
      <div className="bg-steelblue h-full w-full absolute top-0 left-0">
        <div className="flex items-center justify-center text-center relative h-full bottom-24 flex-col">
          <h1 className="text-white text-5xl font-mono font-bold pb-12">r/Wallstreetbets mood of the day:</h1>

          <div className="rounded-lg min-h-32 max-h-32 flex flex-col align-bottom" ref={this.meter}>
            <img src="meterSaturated.png" alt="Mood Meter"  className="h-full w-full" />
          </div>

          <div className="h-48" ref={this.pointer}>
            <img src="pointerv2.png" alt="Mood Pointer" className="h-1/4" />
          </div>

          <div id = "infoBubble" className = " h-42 w-96 bg-white rounded-3xl border-8 flex items-center p-8 flex-row">
            <h1 id = "rateNumDisplay" 
            className = {(this.state.rate > 0 ? "text-green-600" : "text-red-700") + " font-nunito-bold text-4xl order-1"}
            
            >{
              (this.state.posStat / (this.state.posStat + this.state.negStat)).toLocaleString(undefined,{style: 'percent', maximumFractionDigits:0, maximumSignificantDigits:2})
            }</h1>

            <div className=" h-3/4 border-r border-gray-400 border-2 relative left-1/2 order-2"></div>
            <h1 id = "rateCategory"
            className = {(this.state.rate > 0 ? "text-green-600" : "text-red-700") + " relative font-nunito-bold text-2xl order-3 left-3"}
            >{this.categorizeRate()}</h1>

            <h1
            id = "rateDelta"
            className = {(this.state.rate > this.state.prevRate ? "text-green-600" : "text-red-600") +
            " order-4 font-nunito-bold text-2xl relative left-1/3 mr-1" }
            >{((this.state.posStat / (this.state.posStat + this.state.negStat)) 
            - (this.state.prevPosStat / (this.state.prevPosStat + this.state.prevNegStat))).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:1, maximumSignificantDigits:2})
            }
            <h1>Change</h1>
            </h1>

          </div>

        </div>
        
      </div>
    )}
    else{ // loading screen works great
      return(
      <div className="bg-steelblue h-full w-full absolute top-0 left-0">
        <div className="flex items-center justify-center text-center relative h-full bottom-24 flex-col">
          <h1 className="text-white text-5xl font-mono font-bold pb-12">LOADING...</h1>
          <h1 className="text-white text-3xl font-mono font-bold pb-12">May take 1-2 minutes</h1>
          
        </div>
        {this.setRate()}
      </div>
      )
    }
  }
}
