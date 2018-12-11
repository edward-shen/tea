import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import CardView from './CardView';
import Navbar from './Navbar';

import './css/Base.scss';
import './css/Common.scss';

ReactDOM.render(
  <BrowserRouter>
    <div>
      <Navbar />
      <Switch>
        <Route exact path="/">
          <CardView />
        </Route>
        <Route path="/prof/:id" component={() => <p>henlo</p>}></Route>
      </Switch>
    </div>
  </BrowserRouter>, document.getElementById('app'));
