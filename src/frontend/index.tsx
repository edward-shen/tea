import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './css/base.scss';

import Hello from './Hello';

ReactDOM.render(
    <Hello compiler='TypeScript' framework='React' />,
    document.getElementById('app'),
);
