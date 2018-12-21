import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import Navbar from './Navbar';
import AboutView from './views/AboutView';
import AllClassView from './views/AllClassView';
import AllProfessorView from './views/AllProfessorView';
import CardView from './views/CardView';
import ClassView from './views/ClassView';
import ProfessorView from './views/professor/ProfessorView';
import ReportView from './views/reports/ReportView';

import './css/Base.scss';
import Footer from './Footer';

ReactDOM.render(
<BrowserRouter>
    <ApolloProvider client={new ApolloClient({
      link: new HttpLink(),
      cache: new InMemoryCache(),
    })}>
      <Navbar />
      <Switch>
        <Route exact path='/' component={CardView} />
        <Route exact path='/about' component={AboutView} />
        <Route exact path='/class/' component={AllClassView} />
        <Route exact path='/prof/' component={AllProfessorView} />

        <Route path='/report/:id/:prof' component={ReportView} />
        <Route path='/class/:id' component={ClassView} />
        <Route path='/prof/:id' component={ProfessorView} />
      </Switch>
      <Footer />
    </ApolloProvider>
</BrowserRouter>,
document.getElementsByClassName('tea-app')[0]);
