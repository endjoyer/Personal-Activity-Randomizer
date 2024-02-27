'use client';
import { withAuth } from '../components/withAuth';
import ActivityForm from '../components/ActivityForm';
import SectionsList from '../components/SectionsList';
import ActivityRandomizer from '../components/ActivityRandomizer';
import LogoutButton from '@/components/LogoutButton';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';

function Home() {
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
