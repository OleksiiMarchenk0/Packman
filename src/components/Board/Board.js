import React, { Component } from "react";
import Pacman from "../Pacman";
import Ghost from "../Ghost";
import Food from "../Food";
import GameOver from "../GameOver/GameOver";
import "./style.css";

export default class Board extends Component {
  state = {
    isPackmanAlive: true,
    isGameOver: false,
    packmanPosition: {
      top: 0,
      left: 0,
    },
    ghostPosition: {
      top: undefined,
      left: undefined,
    },
    score: undefined,
  };
  constructor(props) {
    super(props);
    this.pacmanRef = React.createRef();
    this.ghostRef = React.createRef();

    this.foods = [];
    this.amountOfFood =
      ((window.innerWidth - this.props.foodSize) *
        (window.innerHeight - this.props.topScoreBoardHeight)) /
        (this.props.foodSize * this.props.foodSize) -
      1;
    for (let i = 0; i < this.amountOfFood; i++) {
      this["food" + i] = React.createRef();
    }
  }
  comparePosition() {
    const { top: topPackman, left: leftPackman } = this.state.packmanPosition;
    const { top: topGhost, left: leftGhost } = this.state.ghostPosition;
    console.log(this.state.packmanPosition, this.state.ghostPosition);
    if (topPackman === topGhost && leftPackman === leftGhost) {
      const score = localStorage.getItem("score");
      this.setState({
        isGameOver: true,
        score: score,
        isPackmanAlive: false,
      });
      this.ghostRef.current.disableGhost();
    }
  }
  componentDidMount() {
    this.intervalFood = setInterval(this.lookForEat, 100);
  }
  componentWillUnmount() {
    clearInterval(this.intervalFood);
  }
  lookForEat = () => {
    const pacmanX = this.pacmanRef.current.state.position.left;
    const pacmanY = this.pacmanRef.current.state.position.top;
    const pacmanSize = this.pacmanRef.current.props.size;

    const pacmanLastX = pacmanX + pacmanSize / 2;
    const pacmanLastY = pacmanY + pacmanSize / 2;

    for (let i = 0; i <= this.amountOfFood; i++) {
      const currentFood = this["food" + i].current;
      if (currentFood) {
        const currentFoodX = currentFood.state.position.left;
        const currentFoodY = currentFood.state.position.top;
        const currentFoodSize = currentFood.props.foodSize;
        const currentFoodLastX = currentFoodX + currentFoodSize / 2;
        const currentFoodLastY = currentFoodY + currentFoodSize / 2;

        if (
          (pacmanX >= currentFoodX && pacmanX <= currentFoodLastX) ||
          (pacmanLastX >= currentFoodX && pacmanLastX <= currentFoodLastX)
        ) {
          if (
            (pacmanY >= currentFoodY && pacmanY <= currentFoodLastY) ||
            (pacmanLastY >= currentFoodY && pacmanLastY <= currentFoodLastY)
          ) {
            if (!currentFood.state.hidden) {
              currentFood.ate();
              this.props.setScore((value) => value + 1);
            }
          }
        }
      }
    }
  };
  getPackmanPosition = (top, left) => {
    this.setState({
      packmanPosition: {
        top: top,
        left: left,
      },
    });
    this.comparePosition();
  };
  getGhostPosition = (top, left) => {
    this.setState({
      ghostPosition: {
        top: top,
        left: left,
      },
    });
    this.comparePosition();
  };

  render() {
    const { foodSize, border, topScoreBoardHeight } = this.props;
    let foods = [];
    let currentTop = 0;
    let currentLeft = 1 * foodSize;
    for (let i = 0; i < this.amountOfFood; i++) {
      if (currentLeft + foodSize >= window.innerWidth - border) {
        currentTop += this.props.foodSize;
        currentLeft = 0;
      }
      if (
        currentTop + foodSize >=
        window.innerHeight - border - topScoreBoardHeight
      ) {
        break;
      }

      const position = { left: currentLeft, top: currentTop };
      currentLeft += foodSize;
      foods.push(
        <Food
          key={`food-elem-${i}`}
          position={position}
          ref={this["food" + i]}
        />
      );
    }

    return (
      <div className="container">
        {this.state.isGameOver ? (
          <GameOver
            score={this.state.score}
            startNewGame={() => {
              this.forceUpdate();
            }}
          />
        ) : null}
        <div className="board">
          {foods}
          <Pacman
            ref={this.pacmanRef}
            isPackmanAlive={this.state.isPackmanAlive}
            getPackmanPosition={this.getPackmanPosition}
          />
          <Ghost
            ref={this.ghostRef}
            color="blue"
            getGhostPosition={this.getGhostPosition}
          />
        </div>
      </div>
    );
  }
}

// TODO: refactor and move to config
Board.defaultProps = {
  foodSize: 50,
  border: 10 * 2,
  topScoreBoardHeight: 50,
};

