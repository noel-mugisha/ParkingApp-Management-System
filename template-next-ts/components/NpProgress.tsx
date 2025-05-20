"use client"
import React, { useEffect, useState } from 'react';
import { ProgressProvider } from '@bprogress/next/app';


const NpProgress = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <ProgressProvider
      height="3px"
      color="#001A55"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
};

export default NpProgress;