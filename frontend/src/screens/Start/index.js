import React, { Component } from 'react';
import './index.css';

class Start extends Component {
  state = {
  	username: ''
  };

  onNameChange = event => {
  	const username = event.target.value;
  	this.setState({ username });
  }

  onFormSumit = event => {
  	event.preventDefault();
  	localStorage.setItem('username', this.state.username);
  	this.props.history.push('/game');
  }

  render() {
  	const { onNameChange, onFormSumit, state } = this;
  	const { username } = state;

  	return (
  	  <div className="start">
  	    <form onSubmit={onFormSumit}>
  	      <input type="text" placeholder="Nome" value={username} onChange={onNameChange} required />
  	      <input type="submit" value="Entrar" />
  	    </form>
  	  </div>
  	);
  }
}

export default Start;