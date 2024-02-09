'use client';
import React from 'react';
import ActivityForm from '../components/ActivityForm';
import SectionsList from '../components/SectionsList';
import ActivityRandomizer from '../components/ActivityRandomizer';

export default function Home() {
  return (
    <main>
      <ActivityForm />
      <SectionsList />
      <ActivityRandomizer />
    </main>
  );
}
