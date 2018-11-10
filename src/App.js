import React, { Component } from "react";
import "./App.css";

const stroke = { stroke: "black", "stroke-linecap": "round" };

function generateBranch({ startX, startY, level, angle, length }) {
  const strokeWidth = (() => {
    switch (level) {
      case 0:
        return 10;
      case 1:
        return 8;
      case 2:
        return 5;
      default:
        throw new Error("too deep");
    }
  })();

  const xDiff = Math.cos(angle) * length;
  const yDiff = Math.sin(angle) * length;

  const nextX = startX + xDiff;
  const nextY = startY + yDiff;

  return {
    paths: (
      <path
        d={`M${startX},${startY} ${nextX},${nextY}`}
        stroke-width={strokeWidth}
        {...stroke}
      />
    ),
    nextX,
    nextY
  };
}

function generateTree() {
  return Array(3)
    .fill(null)
    .reduce((acc, next, level) => {
      if (level === 0) {
        acc.push(
          generateBranch({
            startX: 200,
            startY: 400,
            angle: -Math.PI / 2,
            length: 100,
            level
          })
        );
      } else if (level === 1) {
        const { nextX: startX, nextY: startY } = acc[acc.length - 1];
        const common = { startX, startY, level, length: 75 };
        acc.push(generateBranch({ ...common, angle: -((3 * Math.PI) / 4) }));
        acc.push(generateBranch({ ...common, angle: -(Math.PI / 4) }));
      } else if (level === 2) {
        const left = acc[acc.length - 2];
        const right = acc[acc.length - 1];
        {
          let { nextX: startX, nextY: startY } = left;
          const common = { startX, startY, level, length: 50 };
          acc.push(generateBranch({ ...common, angle: -(Math.PI) }));
          acc.push(generateBranch({ ...common, angle: -(Math.PI / 2) }));
        }
        {
          let { nextX: startX, nextY: startY } = right;
          const common = { startX, startY, level, length: 50 };
          acc.push(generateBranch({ ...common, angle: -(Math.PI / 2) }));
          acc.push(generateBranch({ ...common, angle: 0 }));
        }
      }

      return acc;
    }, [])
    .map(value => value.paths);
}

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
          {generateTree()}
        </svg>
      </div>
    );
  }
}

export default App;
