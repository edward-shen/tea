import * as React from 'react';

import { Link } from 'react-router-dom';
import './css/Nav.scss';
class Navbar extends React.Component<{}, {}> {
  public render() {
    return (
      <nav>
        <Link to='/'>
          <p>Some logo</p>
        </Link>
        <form className='hover-shadow rounded' onSubmit={() => alert('henlo')} action='javascript:void(0)'>
          <input
            type='text'
            name='search'
            autoComplete='off'
            placeholder='Professors · Professors · Classes'/>
        </form>
      </nav>
    );
  }
}

export default Navbar;
