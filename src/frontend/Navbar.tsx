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
        </div>
        <div className='nav-right'>
          <Link to='/about'>
            <div className='hover-shadow rounded button'>
              <p>About</p>
            </div>
          </Link>
        </div>
      </nav>
    );
  }
}

export default Navbar;
