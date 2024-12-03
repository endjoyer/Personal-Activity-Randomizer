import { useState } from 'react';
import Cookies from 'js-cookie';
import LogoutButton from './LogoutButton';
import Lang from './Lang';
import Image from 'next/image';
import parIcon from '../public/images/par-icon.png';
import Contact from './Contact';
import Popup from './Popup';
import ActivityList from './ActivityList';

const Header = ({ isAuthPage }: { isAuthPage?: boolean }) => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isActivityListOpen, setIsActivityListOpen] = useState(false);

  return (
    <header
      className={`sm:flex ${
        isAuthPage ? 'flex' : 'hidden'
      } justify-between items-center p-2 px-5 relative font-medium shadow-lg z-10 gap-3`}
    >
      <div className="flex items-center gap-3">
        <Image
          src={parIcon}
          alt="Personal Activity Randomizer Icon"
          width={40}
        />
        <h1>Personal Activity Randomizer</h1>
      </div>
      <p className="absolute left-1/2 transform -translate-x-1/2">
        {Cookies.get('username')}
      </p>
      <div className="flex gap-4">
        <button onClick={() => setIsActivityListOpen(true)}>Activities</button>
        <Popup
          isOpen={isActivityListOpen}
          onClose={() => setIsActivityListOpen(false)}
        >
          <ActivityList />
        </Popup>
        <Contact
          isContactOpen={isContactOpen}
          setIsContactOpen={setIsContactOpen}
        />
        <Lang />
        {Cookies.get('token') && <LogoutButton />}
      </div>
    </header>
  );
};

export default Header;
