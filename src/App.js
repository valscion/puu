import React, { Component } from "react";
import "./App.css";

const stroke = { stroke: "black", "stroke-linecap": "round" };

const branches = [
  // Trunk
  <path d="M200,400 200,300" stroke-width="10" {...stroke} />,
  
  // Left and right branches
  <path d="M200,300 150,250" stroke-width="8" {...stroke} />,
  <path d="M200,300 250,250" stroke-width="8" {...stroke} />,
  
  // 2 branches for left
  <path d="M150,250 150,215" stroke-width="5" {...stroke} />,
  <path d="M150,250 115,250" stroke-width="5" {...stroke} />,
  
  // 2 branches for right
  <path d="M250,250 250,215" stroke-width="5" {...stroke} />,
  <path d="M250,250 285,250" stroke-width="5" {...stroke} />,
];

class App extends Component {
  render() {
    return (
      <div>
        <svg
          viewBox="0 0 400 400"
          width="400"
          height="400"
          version="1.1"
          baseProfile="full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {branches}
        </svg>
      </div>
    );
  }
}

export default App;
