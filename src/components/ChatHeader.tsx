import React from 'react';
import { UserProfile } from './UserProfile';

export const ChatHeader: React.FC = () => {
  return (
    <header className="p-6 flex justify-end items-center sticky top-0 z-50">
      <UserProfile />
    </header>
  );
};
