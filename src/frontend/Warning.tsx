import * as React from 'react';
import { ErrorColors } from './views/Colors';

interface WarningProps {
  text: string;
  level: 'info' | 'warning' | 'error';
  button?: boolean;
}

class Warning extends React.Component<WarningProps> {
  public render() {
    let className = 'button warning-box';

    if (this.props.button) {
      className += ' hover-shadow';
    }

    switch (this.props.level) {
      case 'error':
        return (
          <div className={className}>
            <div style={{ backgroundColor: ErrorColors.ERROR }}/>
            <p>{this.props.text}</p>
          </div>);
      case 'warning':
        return (
          <div className={className}>
            <div style={{ backgroundColor: ErrorColors.WARN }} />
            <p>{this.props.text}</p>
          </div>);
      case 'info':
        return (
          <div className={className}>
            <div style={{ backgroundColor: ErrorColors.INFO }} />
            <p>{this.props.text}</p>
          </div>);
    }
  }
}

export default Warning;
