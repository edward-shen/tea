import * as React from 'react';
import * as ReactDOM from 'react-dom';

import CardView from './CardView';
import Navbar from './Navbar';

import './css/Base.scss';

ReactDOM.render([
    <Navbar />,
    <CardView />,
    ],
    document.getElementById('app'),
);
