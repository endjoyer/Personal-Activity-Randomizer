'use client';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { selectSection } from '@/redux/sectionsSlice';
import { withAuth } from '../components/withAuth';
import ActivityForm from '../components/ActivityForm';
import SectionsList from '../components/SectionsList';
import ActivityRandomizer from '../components/ActivityRandomizer';
import Header from '@/components/Header';
import HamburgerMenu from '@/components/HamburgerMenu';
import styles from './page.module.css';

function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isClickInsideFormOrButton = target.closest('.activity-form');
      if (!isClickInsideFormOrButton) {
        dispatch(selectSection(null));
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [dispatch]);

  return (
    <>
      <Header />
      <HamburgerMenu />
      <main className={styles.main}>
        <section className={styles.sectionsContainer}>
          <SectionsList />
        </section>
        <section className={styles.techContainer}>
          <ActivityForm />
          <div className={styles.divider}></div>
          <ActivityRandomizer />
        </section>
      </main>
    </>
  );
}

export default withAuth(Home);
