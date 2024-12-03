import Image from 'next/image';
import contactIcon from '../public/images/contact.svg';
import Popup from './Popup';
import { useTranslation } from 'react-i18next';
import ContactPopup from './ContactPopup';

const Contact = ({
  isContactOpen,
  setIsContactOpen,
}: {
  isContactOpen: boolean;
  setIsContactOpen: (open: boolean) => void;
}) => {
  const { t } = useTranslation();

  return (
    <>
      <button title={t('contacts')} onClick={() => setIsContactOpen(true)}>
        <Image src={contactIcon} alt={t('contacts')} width={20} />
      </button>
      <Popup isOpen={isContactOpen} onClose={() => setIsContactOpen(false)}>
        <ContactPopup />
      </Popup>
    </>
  );
};

export default Contact;
