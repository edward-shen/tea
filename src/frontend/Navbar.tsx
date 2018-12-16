import * as React from 'react';

import { Link } from 'react-router-dom';
import './css/Nav.scss';
class Navbar extends React.Component<{}, {}> {
  public render() {
    return (
      <nav>
        <div className='nav-left'>
          <Link to='/'>
            <p>TEA</p>
          </Link>
          <form
            className='hover-shadow rounded button'
            onSubmit={() => alert('henlo')}
            action='javascript:void(0)'>
            <input
              type='text'
              name='search'
              autoComplete='off'
              placeholder='Reports · Professors · Classes'/>
          </form>
          {this.generateButton('/class', 'Classes')}
          {this.generateButton('/prof', 'Professors')}
        </div>
        <div className='nav-right'>
          {this.generateButton('/about', 'About')}
        </div>
      </nav>
    );
  }

  private generateButton(link: string, text: string) {
    return (
      <Link to={link}>
        <div className='hover-shadow rounded button'>
          <p>{text}</p>
        </div>
      </Link>);
  }
}

export default Navbar;
