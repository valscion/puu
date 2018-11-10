import React, { Component } from "react";
import "./App.css";

const stroke = { stroke: "black", "stroke-linecap": "round" };

function genTree({ genRand, maxLevels, baseLength, maxWidth, rootX, rootY }) {
  function genNext({ x, y, angle, levelsRemaining }) {
    if (levelsRemaining <= 0) return null;

    const length = (levelsRemaining / maxLevels) * baseLength;
    const xDiff =
      Math.cos(angle + genRand()) * (length + genRand() * baseLength);
    const yDiff =
      Math.sin(angle + genRand()) * (length + genRand() * baseLength);

    const nextX = x + xDiff;
    const nextY = y + yDiff;

    const widthFactor = levelsRemaining / maxLevels;

    const others =
      levelsRemaining <= 1
        ? null
        : [
            genNext({
              x: nextX,
              y: nextY,
              angle: angle - Math.PI / 14,
              levelsRemaining: levelsRemaining - 1
            }),
            genNext({
              x: nextX,
              y: nextY,
              angle: angle + Math.PI / 8,
              levelsRemaining: levelsRemaining - 1
            })
          ];

    if (
      others &&
      levelsRemaining > 3 &&
      levelsRemaining < maxLevels - 1 &&
      Math.random() < 0.8
    ) {
      const direction = Math.random() < 0.5 ? -1 : 1;

      others.push(
        genNext({
          x: nextX,
          y: nextY,
          angle: angle + (Math.PI / 4) * direction,
          levelsRemaining: 3
        })
      );
    }

    return {
      self: {
        x,
        y,
        nextX,
        nextY,
        width: maxWidth * widthFactor,
        level: maxLevels - levelsRemaining
      },
      others
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
      rootY: 500,
      maxLevels: 10,
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
  const { self, others } = props;
  if (self === null) return null;
  const { x, y, nextX, nextY, width, level } = self;

  return (
    <g data-level={level}>
      <path
        d={`M${x},${y} ${nextX},${nextY}`}
        stroke-width={width}
        {...stroke}
      />
      {others ? others.map((other, i) => <Branch key={i} {...other} />) : null}
    </g>
  );
}

function Leaves(props) {
  const { self, others } = props;
  if (!self) return null;
  const lastLeaf = !others;

  return (
    <>
      {lastLeaf && <Leaf {...self} />}
      {!lastLeaf
        ? others.map((other, i) => <Leaves key={i} {...other} />)
        : null}
    </>
  );
}

function Leaf(props) {
  const { x, y, nextX, nextY } = props;

  const angle = (Math.atan2(nextY - y, nextX - x) * 180) / Math.PI - 90;
  const rotate = `rotate(${angle} ${nextX} ${nextY})`;

  return (
    <ellipse
      cx={nextX}
      cy={nextY}
      rx="3"
      ry="10"
      fill="green"
      stroke-width="3"
      transform={rotate}
    />
  );
}
