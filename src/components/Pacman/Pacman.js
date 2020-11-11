import React, { Component } from "react";
import { ReactComponent as PacmanSvg } from "./pacman.svg";
import "./style.css";

export default class Pacman extends Component {
  state = {
    direction: "right",
    position: {
      top: 0,
      left: 0,
    },
  };

  constructor(props) {
    super(props);
    this.pacmanRef = React.createRef();
  }

  componentDidMount() {
    this.pacmanRef.current.focus();
  }
  handleKeyDown = (event) => {
    const { position } = this.state;
    const { top: currentTop, left: currentLeft } = position;
    const { step, border, size, topScoreBoardHeight } = this.props;
    if (event.key === "ArrowUp") {
      this.setState(
        {
          position: {
            top: Math.max(currentTop - step, 0),
            left: currentLeft,
          },
          direction: "up",
        },
        () => {
          this.props.getPackmanPosition(
            this.state.position.top,this.state.position.left
          );
        }
      );
    } else if (event.key === "ArrowRight") {
      this.setState(
        {
          position: {
            top: currentTop,
            left: Math.min(
              currentLeft + step,
              window.innerWidth - border - size
            ),
          },
          direction: "right",
        },
        () => {
          this.props.getPackmanPosition(
           this.state.position.top,this.state.position.left
          );
        }
      );
    } else if (event.key === "ArrowDown") {
      this.setState(
        {
          position: {
            top: Math.min(
              currentTop + step,
              window.innerHeight - border - size - topScoreBoardHeight
            ),
            left: currentLeft,
          },
          direction: "down",
        },
        () => {
          this.props.getPackmanPosition(
            this.state.position.top,this.state.position.left
          );
        }
      );
    } else if (event.key === "ArrowLeft") {
      this.setState(
        {
          position: {
            top: currentTop,
            left: Math.max(currentLeft - step, 0),
          },
          direction: "left",
        },
        () => {
          this.props.getPackmanPosition(
            this.state.position.top,this.state.position.left
          );
        }
      );
    }
  };

  render() {
    const { direction, position } = this.state;
    return (
      <div
        ref={this.pacmanRef}
        className={`pacman pacman-${direction}`}
        tabIndex="0"
        onKeyDown={this.props.isPackmanAlive ? this.handleKeyDown : null}
        style={position}
      >
        <PacmanSvg />
      </div>
    );
  }
}

Pacman.defaultProps = {
  step: 50, // 50px
  size: 50, // pacman size: 50x50px
  // TODO: move to config
  border: 10 * 2,
  topScoreBoardHeight: 50,
};
