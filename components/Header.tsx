import React from 'react';
import Cookies from 'js-cookie';
import LogoutButton from './LogoutButton';
import Lang from './Lang';

const Header = ({ isAuthPage }: { isAuthPage?: boolean }) => {
  return (
    <header
      className={`sm:flex ${isAuthPage ? 'flex' : 'hidden'
        } justify-between items-center p-4 bg-blue-500 text-white`}
    >
      <h1>PAR</h1>
      <p>{Cookies.get('username')}</p>
      <div className="flex gap-4">

        {Cookies.get('token') && <LogoutButton />}
        <Lang />
      </div>
    </header>
  );
};

export default Header;
