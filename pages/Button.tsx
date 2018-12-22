import * as React from 'react';
import Link from 'next/link';

interface ButtonProps {
  link: string;
  text?: string;
  inner?: React.Component;
}

class Button extends React.Component<ButtonProps> {
  public render() {
    return (
      <Link href={this.props.link}>
        <a>
          <div className='hover-shadow rounded button'>
            {this.props.inner || <p>{this.props.text}</p>}
          </div>
        </a>
      </Link>);
  }
}

export default Button;
