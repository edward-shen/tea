import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Navbar from './Navbar';
import CardView from './views/CardView';
import AboutView from './views/AboutView';
import ReportView from './views/ReportView';
import ClassView from './views/ClassView';
import ProfessorView from './views/ProfessorView';

import './css/Base.scss';
import './css/Common.scss';

ReactDOM.render(
  <BrowserRouter>
    <div>
      <Navbar />
      <Switch>
        <Route exact path="/"><CardView /></Route>
        <Route exact path="/about"><AboutView /></Route>

        <Route path="/report/:id" component={ReportView}></Route>
        <Route path="/class/:id"><ClassView /></Route>
        <Route path="/prof/:id"><ProfessorView /></Route>
      </Switch>
    </div>
  </BrowserRouter>, document.getElementById('app'));
