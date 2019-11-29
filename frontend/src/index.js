import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Start from './screens/Start';
import Game from './screens/Game';
import Admin from './screens/Admin';

import * as serviceWorker from './serviceWorker';
import './index.css';

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route component={Start} path="/" exact />
      <Route component={Game} path="/game" exact />
      <Route component={Admin} path="/admin" exact />
    </Switch>
  </BrowserRouter>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
