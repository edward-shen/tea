import * as React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  link: string;
  text: string;
}

class Button extends React.Component<ButtonProps> {
  public render() {
    return (
      <Link to={this.props.link}>
      <div className='hover-shadow rounded button'>
        <p>{this.props.text}</p>
      </div>
    </Link>);
  }
}

export default Button;
