import { useEffect } from 'preact/hooks';
import { useLocation } from 'react-router-dom';
import { PropsWithChildren } from 'preact/compat';

const storage_key = 'current_location';

export const LocationSaver = ({ children }: PropsWithChildren) => {
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem(storage_key, location.pathname);
  });

  return <>{children}</>;
};

export const getSavedLocation = () => {
  return localStorage.getItem(storage_key);
};