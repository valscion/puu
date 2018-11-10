import React, { Component } from "react";
import "./App.css";

const stroke = { stroke: "black", "stroke-linecap": "round" };

function genTree({ genRand, maxLevels, baseLength, maxWidth, rootX, rootY }) {
  function genNext({ x, y, angle, levelsRemaining }) {
    if (levelsRemaining === 0) return null;

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
      rootX: 250,
      rootY: 500,
      maxLevels: 8,
      baseLength: 75,
      maxWidth: 10
    });

    return (
      <div>
        <svg
          viewBox="0 0 500 500"
          width="500"
          height="500"
          version="1.1"
          baseProfile="full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Branch {...trunk} />
          <Leaves {...trunk} />
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
      {left && right ? (
        <>
          <Branch {...left} />
          <Branch {...right} />
        </>
      ) : null}
    </g>
  );
}

function Leaves(props) {
  const { self, left, right } = props;
  if (self === null) return null;
  const { nextX, nextY, level } = self;

  if (level < 3) {
    return (
      <>
        <Leaves {...left} />
        <Leaves {...right} />
      </>
    );
  }

  const lastLeaf = !left && !right;

  return (
    <>
      {lastLeaf && <Leaf x={nextX} y={nextY} />}
      {left && right ? (
        <>
          <Leaves {...left} />
          <Leaves {...right} />
        </>
      ) : null}
    </>
  );
}

function Leaf(props) {
  const { x, y } = props;

  return <ellipse cx={x} cy={y} rx="3" ry="10" fill="green" stroke-width="3" />;
}
