'use client';
import '../utils/i18n';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import React from 'react';

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}
