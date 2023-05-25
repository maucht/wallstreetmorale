import React, { Component } from 'react'
import "../css/main.css"

export default class Home extends Component {
  render() {
    return (
      <div class = " bg-steelblue h-full w-full absolute top-0 left-0">
        <div className="flex items-center justify-center text-center relative h-full bottom-28">
            <h1 className="text-white text-5xl font-mono font-bold">r/Wallstreetbets mood of the day:</h1>
        </div>
      </div>
    )
  }
}

