"use client";
import { createContext, useContext } from 'react';

interface AppContextType {
  user: User;
  setUser: (user: User) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};