import React, { Component } from 'react';
import io from 'socket.io-client';
import Slider from "react-slick";
 import Icon from 'react-icons-kit';
import {medal} from 'react-icons-kit/entypo/medal';
import './index.css';

const Question = ({ question, answerQuestion, player }) => {
  let isAlreadyAnswer = false;
  let isCorrect = false

  player.answered.forEach(questionAnswered => {
  	if(questionAnswered.questionId === question._id) {
  	  isAlreadyAnswer = true;
  	  isCorrect = questionAnswered.correct;
  	}
  });

  const backgroundColor = isAlreadyAnswer && isCorrect ? '#4caf50' : isAlreadyAnswer && !isCorrect ? '#f44336' : '#1565c0';

  return (
  	<div className="question" style={{ backgroundColor }}>

  	  <h2>{ question.title }</h2>
  	  { question.answers.map(answer => <button disabled={isAlreadyAnswer} key={answer} style={{ backgroundColor }} onClick={() => answerQuestion(question._id, answer)}>{ answer }</button>) }
  	</div>
  );
}

class GameComponent extends Component {
  render() {
  	const { questions, player, onAnswerQuestion } = this.props;
  	return (
  	  <div className="gameComponent">
  	    <header>
  	      <b>{player.username}</b>
  	      <span>{player.points}</span>
  	    </header>
  	    <Slider dots={true} speed={500} slidesToShow={questions.length} slidesToScroll={questions.length} infinite={true}>
  	      { questions.map(question => <Question key={question._id} player={player} question={question} answerQuestion={onAnswerQuestion} />) }
  	    </Slider>
  	  </div>
  	);
  }
}

const Top = ({ playersTop }) => (
  <div className="top">
    <Icon icon={medal} className="top-icon" size={64} />
    <h1>{ playersTop[0].username } ({ playersTop[0].points })</h1>
    { playersTop[1] ? <h2>{ playersTop[1].username } ({ playersTop[1].points })</h2> : null }
    { playersTop[2] ? <h3>{ playersTop[2].username } ({ playersTop[2].points })</h3> : null }
  </div>
);

class Game extends Component {
  socket = io(`http://${window.location.hostname}:8080/`);

  state = {
  	waitingStart: true,
    error: '',
  	playersTop: [],
  	player: { username: localStorage.getItem('username'), points: 0, answered: [] },
  	questions: []
  }

  constructor(props) {
  	super(props);

  	const username = localStorage.getItem('username');

  	if(!username)
  	  return this.props.history.push('/');
  }

  componentDidMount() {
    this.socket.emit('enter-game', localStorage.getItem('username'));
  	this.socket.on('enter-error', error => this.setState({ error, waitingStart: false }));
  	this.socket.on('on-start-game', values => this.setState({ questions: values.questions, waitingStart: false, alreadyStarted: false }));
  	this.socket.on('on-finish-game', values => this.setState({ playersTop: values.top }));
  	this.socket.on('on-answer', values => this.setState({ player: values.player }));	
  }

  answerQuestion = (questionId, answer) => {
  	this.socket.emit('answer', { questionId, answer });
  }

  render() {
  	const { answerQuestion } = this;
  	const { waitingStart, alreadyStarted, error, player, questions, playersTop } = this.state;

  	return (
  	  <div className="game">
  	    { waitingStart ? <h1>Waiting Game..</h1> : null }
  	    { error ? <h1>{error}</h1> : null }
  	    { alreadyStarted ? <h1>The Game is already Running</h1> : null }
  	    { !waitingStart && !error && !alreadyStarted && !playersTop.length ? <GameComponent questions={questions} player={player} onAnswerQuestion={answerQuestion} /> : null }
  	    { playersTop.length ? <Top playersTop={playersTop} /> : null }
  	  </div>
  	);
  }
}

export default Game;