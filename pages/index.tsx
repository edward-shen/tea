import * as React from 'react';

import Navbar from './Navbar';
import AboutView from './views/AboutView';
import AllClassView from './views/AllClassView';
import AllProfessorView from './views/AllProfessorView';
import CardView from './views/CardView';
import ClassView from './views/ClassView';
import ProfessorView from './views/professor/ProfessorView';
import ReportView from './views/reports/ReportView';

// import './css/Base.scss';
import Footer from './Footer';

class Root extends React.Component<{}>{
  public render() {
    return (
      <div>
        <Navbar />
        <CardView />
        <Footer />
      </div>);
  }
}

export default Root;
