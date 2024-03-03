'use client';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { selectSection } from '@/redux/sectionsSlice';
import { withAuth } from '../components/withAuth';
import ActivityForm from '../components/ActivityForm';
import SectionsList from '../components/SectionsList';
import ActivityRandomizer from '../components/ActivityRandomizer';
import LogoutButton from '@/components/LogoutButton';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';

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
    <main className="flex">
      <section className="w-60 p-4 pb-6">
        <LogoutButton />
        <SectionsList />
      </section>
      <section className="flex-1">
        <ActivityForm />
        <ActivityRandomizer />
      </section>
    </main>
  );
}

export async function loader(request: NextRequest) {
  const cookies = request.headers.get('Cookie');
  if (!cookies) {
    throw redirect('/login');
  }

  const token = cookies.split(';').find((c) => c.trim().startsWith('token='));
  if (!token) {
    throw redirect('/login');
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
    await jwtVerify(token.split('=')[1], secret);
    return new Response(null);
  } catch (error) {
    throw redirect('/login');
  }
}

export default withAuth(Home);
