import * as React from 'react';

import './css/Nav.scss';
class Navbar extends React.Component<{}, {}> {
  public render() {
    return (
      <nav>
        <a href="/">
          <p>Some logo</p>
        </a>
        <form className="hover-shadow rounded" onSubmit={() => alert('henlo')} action='javascript:void(0)'>
          <input
            type="text"
            name="search"
            autoComplete="off"
            placeholder="Classes, Professors, anything!"/>
        </form>
      </nav>
    );
  }
}

export default Navbar;
