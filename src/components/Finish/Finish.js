import React, { Component } from "react";
import axios from "axios";
import "./style.css";

class Finish extends Component {
  state = {
    name:'',
    score:undefined
  };
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  componentDidMount(){
    const {score} = this.props;
    this.setState({score:score})
  }
   submitHandler = (e) => {
    e.preventDefault();
    const url = "http://localhost:3000/score";
    axios.post(url, this.state).then((response) => console.log(response));
    localStorage.clear();
  };
  render() {
    const { name,score } = this.state;
    return (
      <div className="game-over-component">
        <h3>Your score: {score}</h3>
        <form>
        <input
          type="text"
          value={name}
          placeholder="Enter your name"
          onChange={this.changeHandler}
          name="name"
        />
       <div className="buttons">
       <button onClick={this.submitHandler}>Save results</button>
       <button onClick={this.props.startNewGame}>Play again</button>
       </div>
        </form>
        
      </div>
    );
  }
}

export default Finish;
