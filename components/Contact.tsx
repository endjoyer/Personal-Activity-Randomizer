import Image from 'next/image';
import contactIcon from '../public/images/contact.svg';
import ContactPopup from './ContactPopup';
import { useTranslation } from 'react-i18next';

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
      {isContactOpen && (
        <ContactPopup onClose={() => setIsContactOpen(false)} />
      )}
    </>
  );
};

export default Contact;
