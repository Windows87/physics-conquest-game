const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const ip = require('ip');
const path = require('path');
const routes = require('./app/routes/');
const Question = require('./app/models/Question.js');

const app = express();
const myIp = ip.address();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + '/public'));

app.use('/api', routes);
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.listen(80, err => {
  if(err)
  	return console.log('\x1b[31m', 'Error on start Server');

  console.log('\x1b[32m', `Server Running in ${myIp}`);
});

server.listen(8080, err => {
  if(err)
  	return console.log('\x1b[31m', 'Error on start Socket');
});

let players = [];
let isGameStarted = false;
let questions = [];

function getAllQuestions() {
  return new Promise((next, reject) => {
  	Question.find({}).exec((err, questions) => {
  	  if(err)
  	  	return reject(err);

  	  next(questions);
  	})
  });
}

function verifyCorrectAnswer(questionId, answer) {
  let isCorrectAnswer = false;

  questions.forEach(question => {
    if(question._id === questionId && question.correct_answer === answer)
      isCorrectAnswer = true;
  });

  return isCorrectAnswer;
}

function addPointToPlayer(playerId, questionId) {
  players = players.map(player => {
  	if(player.id === playerId) {
  	  player.points++;
  	  player.answered.push({ questionId, correct: true });
  	}

  	return player;
  });
}

function removePointToPlayer(playerId, questionId) {
  players = players.map(player => {
  	if(player.id === playerId) {
  	  player.points--;
  	  player.answered.push({ questionId, correct: false });
  	}

  	return player;
  });
}

function getPlayersTop() {
  return players.sort().reverse();
}

function sendMessageToAllPlayers(name, content) {
  players.forEach(player => io.sockets.connected[player.id].emit(name, content));
}

function getPlayer(id) {
  let player;

  players.forEach(playerEach => {
    if(playerEach.id === id)
      player = playerEach;
  });

  return player;
}

io.on('connection', socket => {
  socket.on('enter-game', async username => {
  	if(isGameStarted)
  	  return socket.emit('enter-error', 'The Game is already Running');
  	players.push({ id: socket.id, username, points: 0, answered: [] });
  });

  socket.on('start-game', async () => {
  	isGameStarted = true;
  	questions = await getAllQuestions();
  	sendMessageToAllPlayers('on-start-game', { questions });
  });

  socket.on('finish-game', async () => {
  	isGameStarted = false;
  	sendMessageToAllPlayers('on-finish-game', { top: getPlayersTop() });
  });

  socket.on('answer', ({ questionId, answer }) => {
  	const isCorrectAnswer = verifyCorrectAnswer(questionId, answer);

  	if(isCorrectAnswer)
  	  addPointToPlayer(socket.id, questionId);
  	else
  	  removePointToPlayer(socket.id, questionId);

    const player = getPlayer(socket.id);

  	socket.emit('on-answer', { isCorrectAnswer, questionId, players, player });
  });

  socket.on('disconnect', () => {
    players = players.filter(player => player.id !== socket.id);
  });
});