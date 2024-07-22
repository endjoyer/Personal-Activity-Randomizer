import React from 'react';
import Cookies from 'js-cookie';
import LogoutButton from './LogoutButton';
import Lang from './Lang';

const Header = ({ isAuthPage }: { isAuthPage?: boolean }) => {
  return (
    <header
      className={`sm:flex ${isAuthPage ? 'flex' : 'hidden'
        } justify-between items-center p-4 bg-blue-500 text-white relative`}
    >
      <h1>PAR</h1>
      <p className="absolute left-1/2 transform -translate-x-1/2">{Cookies.get('username')}</p>
      <div className="flex gap-4">

        {Cookies.get('token') && <LogoutButton />}
        <Lang />
      </div>
    </header>
  );
};

export default Header;
