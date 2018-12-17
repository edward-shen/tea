import * as React from 'react';

import InfoIcon from './assets/InfoIcon';

import './css/Warning.scss';

interface WarningProps {
  text: string;
  level: 'info' | 'warning' | 'error';
}

class Warning extends React.Component<WarningProps> {
  public render() {
    switch (this.props.level) {
      case 'info':
      case 'warning':
      case 'error':
      default:
        return (
          <div className='button warning'>
            <InfoIcon />
            <p>{this.props.text}</p>
          </div>
        );
    }
  }
}

export default Warning;
