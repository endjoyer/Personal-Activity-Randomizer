import React from 'react';

import Cookies from 'js-cookie';
import LogoutButton from './LogoutButton';
import Lang from './Lang';

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-blue-500 text-white">
      <h1>Personal Activity Randomizer</h1>
      <div className="flex gap-4">
        {Cookies.get('token') && <LogoutButton />}
        <Lang />
      </div>
    </header>
  );
};

export default Header;
