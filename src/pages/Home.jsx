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

    prevPosStat: null,
    prevNegStat: null,
    prevRate: null,
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
      const posStat = response.data.datas[0]['posStat']
      const negStat = response.data.datas[0]['negStat']

      this.setState({
        posStat,
        negStat,
      }, () => {
        const rate = -1 + 2 * (this.state.posStat / (this.state.posStat + this.state.negStat));
        this.setState({
          rate: rate,
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
      console.log("Positive:", this.state.posStat)
      console.log("Negative:", this.state.negStat)
  
      let pointer = this.pointer.current
      let meter = this.meter.current
  
      const rate = -1 + 2 * (this.state.posStat / (this.state.posStat + this.state.negStat));
      console.log("In movePointer set rate:", rate)
  
      if (pointer && meter) {
        const meterWidth = meter.offsetWidth
        const calculatedMovement = rate * meterWidth
        console.log('Mood Meter width:', meterWidth)
        console.log('Rate:', rate)
        
        if(calculatedMovement >= 0){
          pointer.style.marginRight = "0px"
          pointer.style.marginLeft = `${calculatedMovement}px`
        }
        else{
          pointer.style.marginLeft = "0px"
          pointer.style.marginRight = `${calculatedMovement}px`
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
    else if (this.state.rate >= 0.5){
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
    else if(this.state.rate > -1.00){
      return "Very Bad"
    }
    else if(this.state.rate === -1.00){
      return "Terrible"
    }
    else{ // this should not happen
      return "Neutral"
    }
  }

  render() {
    return (
      <div className="bg-steelblue h-full w-full absolute top-0 left-0">
        <div className="flex items-center justify-center text-center relative h-full flex-col">
          <h1 className="text-white text-5xl font-mono font-bold pb-12">r/Wallstreetbets mood of the day:</h1>

          <div className="rounded-lg min-h-32 max-h-32 flex flex-col align-bottom pl-12 pr-12" ref={this.meter}>
            <img src="meterv2.png" alt="Mood Meter"  className="h-full" />
          </div>

          <div className="h-48" ref={this.pointer}>
            <img src="pointerv2.png" alt="Mood Pointer" className="h-1/4" />
          </div>

          <div id = "infoBubble" className = " h-42 w-96 bg-white rounded-3xl border-8 flex items-center p-8 flex-row">
            <h1 id = "rateNumDisplay" 
            className = {(this.state.rate > 0 ? "text-green-600" : "text-red-700") + " font-nunito-bold text-5xl order-1"}
            
            >{(this.state.posStat / (this.state.posStat + this.state.negStat)).toPrecision(2).toString().substring(2)}%</h1>

            <div className=" h-3/4 border-r border-gray-400 border-2 relative left-1/2 order-2"></div>
            <h1 id = "rateCategory"
            className = {(this.state.rate > 0 ? "text-green-600" : "text-red-700") + " relative font-nunito-bold text-3xl order-3 left-8"}
            >{this.categorizeRate()}</h1>

            <h1
            id = "rateDelta"
            className = " order-4 font-nunito-bold text-2xl relative left-1/3"
            >+7%</h1>

          </div>

        </div>
      </div>
    );
  }
}
