import React, { useState } from 'react';
import styles from './ContactPopup.module.css';
import { useTranslation } from 'react-i18next';

const ContactPopup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({ email: '' });
  const { t } = useTranslation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'email') {
      const emailReg = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/;
      setErrors({
        ...errors,
        email: emailReg.test(value) ? '' : t('invalidEmail'),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (errors.email) {
      alert(t('formErrors'));
      return;
    }

    try {
      const response = await fetch('https://formspree.io/f/movqvvew', {
        method: 'POST',
        body: new FormData(e.target as HTMLFormElement),
        mode: 'no-cors',
      });

      if (response) {
        alert(t('messageSent'));
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('Form submission error');
      }
    } catch (error) {
      alert(t('sendError'));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.leftSide}>
          <a
            href="mailto:alekseydevweb@gmail.com"
            className={styles.emailDetails}
            aria-label="Email"
          >
            <img src="/images/envelope.svg" alt="Email" />
            <div className={styles.topic}>Email</div>
            <div className={styles.textTwo}>alekseydevweb@gmail.com</div>
          </a>
          <a
            href="https://github.com/endjoyer"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubDetails}
            aria-label="GitHub"
          >
            <img src="/images/github.svg" alt="GitHub" />
            <div className={styles.topic}>GitHub</div>
            <div className={styles.textTwo}>github.com/endjoyer</div>
          </a>
          <a
            href="https://t.me/endjoyer"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.telegramDetails}
            aria-label="Telegram"
          >
            <img src="/images/telegram.svg" alt="Telegram" />
            <div className={styles.topic}>Telegram</div>
            <div className={styles.textTwo}>@endjoyer</div>
          </a>
        </div>
        <div className={styles.rightSide}>
          <div className={styles.topicText}>{t('sendPrompt')}</div>
          <p>{t('formIntro')}</p>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputBox}>
              <input
                type="text"
                placeholder={t('namePlaceholder')}
                name="name"
                value={formData.name}
                onChange={handleChange}
                aria-label={t('namePlaceholder')}
              />
            </div>
            <div className={`${styles.inputBox} ${styles.whisValidation}`}>
              <input
                type="text"
                placeholder={t('emailPlaceholder')}
                name="email"
                value={formData.email}
                onChange={handleChange}
                aria-label={t('emailPlaceholder')}
                aria-describedby="emailError"
              />
              <label id="emailError" className={styles.errorLabel}>
                {errors.email}
              </label>
            </div>
            <div className={`${styles.inputBox} ${styles.messageBox}`}>
              <textarea
                placeholder={t('messagePlaceholder')}
                name="message"
                value={formData.message}
                onChange={handleChange}
                aria-label={t('messagePlaceholder')}
              ></textarea>
            </div>
            <div className={styles.button}>
              <input type="submit" value={t('sendButton')} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPopup;
