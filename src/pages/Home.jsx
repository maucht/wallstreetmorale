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


    let instance = axios.create({
      baseURL: 'https://wsmapi.onrender.com/',
    });

    instance.get('api/dailystats').then(response => {
      console.log(response.data.datas[0])
      const resLength = response.data.datas.length
      const posStat = response.data.datas[resLength - 1]['posStat']
      const negStat = response.data.datas[resLength - 1]['negStat']

      const prevPosStat = response.data.datas[resLength - 2]['posStat']
      const prevNegStat = response.data.datas[resLength - 2]['negStat']

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
    return (
      <div className="bg-steelblue h-full w-full absolute top-0 left-0">
        <div className="flex items-center justify-center text-center relative h-full bottom-28 flex-col">
          <h1 className="text-white text-5xl font-mono font-bold pb-12">r/Wallstreetbets mood of the day:</h1>

          <div className="rounded-lg min-h-32 max-h-32 flex flex-col align-bottom" ref={this.meter}>
            <img src="meterv2.png" alt="Mood Meter"  className="h-full w-full" />
          </div>

          <div className="h-48" ref={this.pointer}>
            <img src="pointerv2.png" alt="Mood Pointer" className="h-1/4" />
          </div>

          <div id = "infoBubble" className = " h-42 w-96 bg-white rounded-3xl border-8 flex items-center p-8 flex-row">
            <h1 id = "rateNumDisplay" 
            className = {(this.state.rate > 0 ? "text-green-600" : "text-red-700") + " font-nunito-bold text-4xl order-1"}
            
            >{(this.state.rate !== 1.00) ? 
              this.state.posStat / (this.state.posStat + this.state.negStat).toPrecision(2).toString().substring(2) :
              this.state.posStat / (this.state.posStat + this.state.negStat).toPrecision(2).toString().substring(0) + "00"
            }%</h1>

            <div className=" h-3/4 border-r border-gray-400 border-2 relative left-1/2 order-2"></div>
            <h1 id = "rateCategory"
            className = {(this.state.rate > 0 ? "text-green-600" : "text-red-700") + " relative font-nunito-bold text-2xl order-3 left-6"}
            >{this.categorizeRate()}</h1>

            <h1
            id = "rateDelta"
            className = " order-4 font-nunito-bold text-2xl relative left-1/3"
            >{(this.state.prevRate !== 1.00) ? 
              this.state.prevPosStat / (this.state.prevPosStat + this.state.prevNegStat).toPrecision(2).toString().substring(2) :
              this.state.prevPosStat / (this.state.prevPosStat + this.state.prevNegStat).toPrecision(2).toString().substring(0) + "00"
            }%</h1>

          </div>

        </div>
      </div>
    );
  }
}
