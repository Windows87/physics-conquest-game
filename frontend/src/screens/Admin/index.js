import React, { Component } from 'react';
import io from 'socket.io-client';
import './index.css';

class Admin extends Component {
  socket = io(`http://${window.location.hostname}:8080/`);

  startGame = () => {
    this.socket.emit('start-game');
  }

  finishGame = () => {
  	this.socket.emit('finish-game');
  }

  render() {
  	const { startGame, finishGame } = this;

  	return (
  	  <div>
  	    <button onClick={startGame}>Start Game</button>
  	    <button onClick={finishGame}>Finish Game</button>
  	  </div>
  	);
  }
}

export default Admin;