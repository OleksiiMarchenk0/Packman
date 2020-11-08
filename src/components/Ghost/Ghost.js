import React, { Component } from "react";
import { ReactComponent as GhostSvg } from "./ghost.svg";
import "./style.css";
export default class Ghost extends Component {
  state = {
    isActive: true,
    direction: "left",
    position: {
      top: 500,
      left: 200,
    },
  };

  componentDidMount() {
    this.changeDirectionInterval = setInterval(this.changeDirection, 2000);
    //TODO : 3 levels-> easy - 1000ms, medium - 500ms, hard - 200ms
    this.moveInterval = setInterval(this.move, 1000);
  }
  disableGhost() {
    const { isActive } = this.state;
    if (isActive) {
      this.componentWillUnmount();
    }
  }
  componentWillUnmount() {
    clearInterval(this.changeDirectionInterval);
    clearInterval(this.moveInterval);
  }

  changeDirection = () => {
    const arrayOfMovement = ["left", "up", "down", "right"];
    const movement = Math.floor(Math.random() * 4);
    this.setState({ direction: arrayOfMovement[movement] });
  };

  move = () => {
    const { direction,position } = this.state;
    const {top:currentTop,left:currentLeft} = position;
    const { step, border, size, topScoreBoardHeight } = this.props;

    if (direction === "up") {
      this.setState(
        {
          position: {
            // top: currentTop - step,
            top: Math.max(currentTop - step, 0),
            left: currentLeft,
          },
        },
        this.props.getGhostPosition(currentTop, currentLeft)
      );
    } else if (direction === "right") {
      this.setState(
        {
          position: {
            top: currentTop,
            // left: currentLeft + step
            left: Math.min(
              currentLeft + step,
              window.innerWidth - border - size
            ),
          },
        },
        this.props.getGhostPosition(currentTop, currentLeft)
      );
    } else if (direction === "down") {
      this.setState(
        {
          position: {
            // top: currentTop + step,
            top: Math.min(
              currentTop + step,
              window.innerHeight - border - size - topScoreBoardHeight
            ),
            left: currentLeft,
          },
        },
        this.props.getGhostPosition(currentTop, currentLeft)
      );
    } else if (direction === "left") {
      this.setState(
        {
          position: {
            top: currentTop,
            // left: currentLeft - step
            left: Math.max(currentLeft - step, 0),
          },
        },
        this.props.getGhostPosition(currentTop, currentLeft)
      );
    }
  };

  render() {
    const { color } = this.props;
    return (
      <div style={this.state.position} className="ghost">
        <GhostSvg className={`ghost-${color}`} />
      </div>
    );
  }
}

Ghost.defaultProps = {
  color: "pink",
  step: 50, // 50px
  size: 50, // ghost size: 50x50px
  // TODO: move to config
  border: 10 * 2,
  topScoreBoardHeight: 50,
};
