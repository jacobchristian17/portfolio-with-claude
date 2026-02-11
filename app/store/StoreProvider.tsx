"use client";
import { Provider } from 'react-redux';
import { store } from './store';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}><div id="store-provider">{children}</div></Provider>;
}