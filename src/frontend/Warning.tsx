import * as React from 'react';
import { ErrorColors } from './views/Colors';

interface WarningProps {
  text?: string;
  level: 'info' | 'warn' | 'error';
  button?: boolean;
}

class Warning extends React.Component<WarningProps> {
  public render() {
    let className = 'button warning-box';

    if (this.props.button) {
      className += ' hover-shadow';
    }

    const text = this.props.text ? <p>{this.props.text}</p> : this.props.children;
    switch (this.props.level) {
      case 'error':
        return (
          <div className={className}>
            <div style={{ backgroundColor: ErrorColors.ERROR }}/>
            {text}
          </div>);
      case 'warn':
        return (
          <div className={className}>
            <div style={{ backgroundColor: ErrorColors.WARN }} />
            {text}
          </div>);
      case 'info':
        return (
          <div className={className}>
            <div style={{ backgroundColor: ErrorColors.INFO }} />
            {text}
          </div>);
    }
  }
}

export default Warning;
