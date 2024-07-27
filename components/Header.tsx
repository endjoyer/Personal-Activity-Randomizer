import React from 'react';
import Cookies from 'js-cookie';
import LogoutButton from './LogoutButton';
import Lang from './Lang';
import Image from 'next/image';
import parIcon from '../public/par-icon.png';

const Header = ({ isAuthPage }: { isAuthPage?: boolean }) => {
  return (
    <header
      className={`sm:flex ${isAuthPage ? 'flex' : 'hidden'
        } justify-between items-center p-2 bg-cream relative font-medium`}
    >
      <div className="flex items-center gap-3">
        <Image src={parIcon} alt="Personal Activity Randomizer Icon" width={40} />
        <h1>Personal Activity Randomizer</h1>
      </div>
      <p className="absolute left-1/2 transform -translate-x-1/2">{Cookies.get('username')}</p>
      <div className="flex gap-4">
        {Cookies.get('token') && <LogoutButton />}
        <Lang />
      </div>
    </header>
  );
};

export default Header;

