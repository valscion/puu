import React, { Component } from "react";
import "./App.css";

const stroke = { stroke: "black", "stroke-linecap": "round" };

function genTree({ genRand, maxLevels, baseLength, maxWidth, rootX, rootY }) {
  function genNext({ x, y, angle, levelsRemaining }) {
    if (levelsRemaining === 0) return { self: null, left: null, right: null };

    const length = (levelsRemaining / maxLevels) * baseLength;
    const xDiff =
      Math.cos(angle + genRand()) * (length + genRand() * baseLength);
    const yDiff =
      Math.sin(angle + genRand()) * (length + genRand() * baseLength);

    const nextX = x + xDiff;
    const nextY = y + yDiff;

    const widthFactor = levelsRemaining / maxLevels;

    return {
      self: {
        x,
        y,
        nextX,
        nextY,
        width: maxWidth * widthFactor,
        level: maxLevels - levelsRemaining
      },
      left: genNext({
        x: nextX,
        y: nextY,
        angle: angle - Math.PI / 10,
        levelsRemaining: levelsRemaining - 1
      }),
      right: genNext({
        x: nextX,
        y: nextY,
        angle: angle + Math.PI / 10,
        levelsRemaining: levelsRemaining - 1
      })
    };
  }

  return genNext({
    x: rootX,
    y: rootY,
    angle: -Math.PI / 2,
    levelsRemaining: maxLevels
  });
}

export default class App extends Component {
  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown = () => {
    this.forceUpdate();
  };

  render() {
    const genRand = () => Math.PI * ((Math.random() - 0.5) * (1 / 16));
    const trunk = genTree({
      genRand,
      rootX: 200,
      rootY: 400,
      maxLevels: 8,
      baseLength: 75,
      maxWidth: 10
    });

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
          <Branch {...trunk} />
        </svg>
      </div>
    );
  }
}

function Branch(props) {
  const { self, left, right } = props;
  if (self === null) return null;
  const { x, y, nextX, nextY, width, level } = self;

  return (
    <g data-level={level}>
      <path
        d={`M${x},${y} ${nextX},${nextY}`}
        stroke-width={width}
        {...stroke}
      />
      <Branch {...left} />
      <Branch {...right} />
    </g>
  );
}
