import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Navbar from './Navbar';
import AboutView from './views/AboutView';
import CardView from './views/CardView';
import ClassView from './views/ClassView';
import ProfessorView from './views/ProfessorView';
import ReportView from './views/ReportView';

import './css/Base.scss';
import './css/Common.scss';

ReactDOM.render(
<BrowserRouter>
    <div>
      <Navbar />
      <Switch>
        <Route exact path='/' component={CardView}></Route>
        <Route exact path='/about' component={AboutView}></Route>

        <Route path='/report/:id' component={ReportView} />
        <Route path='/class/:id' component={ClassView} />
        <Route path='/prof/:id' component={ProfessorView} />
      </Switch>
    </div>
</BrowserRouter>,
document.getElementById('app'));
