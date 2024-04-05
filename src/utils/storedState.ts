import { useState } from 'preact/hooks';

export function useStoredState<T>(
  key: string,
  defaultValue: T,
): [T, (value: T) => void] {
  const [value, setValue] = useState(
    JSON.parse(localStorage.getItem(key) ?? 'null') ?? defaultValue,
  );

  const setAndStoreValue = (newValue: T) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setAndStoreValue];
}
