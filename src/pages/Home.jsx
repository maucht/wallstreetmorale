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
      const posStat = response.data.datas[0]['posStat']
      const negStat = response.data.datas[0]['negStat']

      this.setState({
        posStat,
        negStat,
        statsLoaded: true,
      }, () => {
        const rate = -1 + 2 * (this.state.posStat / (this.state.posStat + this.state.negStat));
        this.setState({
          rate: rate
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
        const meterImage = meter.querySelector('img')
        meterImage.addEventListener('load', () => {
          const meterWidth = meterImage.offsetWidth
          console.log('Mood Meter width:', meterWidth)
          console.log('Rate:', this.state.rate)

          pointer.style.marginLeft = `${this.state.rate * meterWidth}px`
        });
      }

      this.setState({
        pointerMoved: true,
      });
    }
  };

  render() {
    return (
      <div className="bg-steelblue h-full w-full absolute top-0 left-0">
        <div className="flex items-center justify-center text-center relative h-full bottom-28 flex-col">
          <h1 className="text-white text-5xl font-mono font-bold pb-12">r/Wallstreetbets mood of the day:</h1>

          <div className="rounded-lg min-h-32 max-h-32 flex flex-col align-bottom pl-12 pr-12" ref={this.meter}>
            <img src="meterv2.png" alt="Mood Meter" className="h-full" />
          </div>

          <div className="h-48" ref={this.pointer}>
            <img src="pointerv2.png" alt="Mood Pointer" className="h-1/4" />
          </div>
        </div>
      </div>
    );
  }
}
