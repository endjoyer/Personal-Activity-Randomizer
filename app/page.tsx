'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { withAuth } from '../components/withAuth';
import ActivityForm from '../components/ActivityForm';
import SectionsList from '../components/SectionsList';
import ActivityRandomizer from '../components/ActivityRandomizer';
import LogoutButton from '@/components/LogoutButton';

function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.replace('/login');
    }
  }, [router]);

  if (!Cookies.get('token')) {
    return null;
  }

  return (
    <main className="flex">
      <div className="w-1/4">
        <LogoutButton />
        <SectionsList />
      </div>
      <div className="w-3/4">
        <ActivityForm />
        <ActivityRandomizer />
      </div>
    </main>
  );
}

export default withAuth(Home);
