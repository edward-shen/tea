import * as React from 'react';
import { Link } from 'react-router-dom';

import Button from './Button';

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
          <Button link='/class' text='Classes' />
          <Button link='/prof' text='Professors' />
        </div>
        <div className='nav-right'>
          <Button link='/about' text='About' />
        </div>
      </nav>
    );
  }
}

export default Navbar;
