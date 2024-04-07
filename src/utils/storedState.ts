import { useEffect, useState } from 'preact/hooks';

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

interface TimestampedData<T> {
  data: T;
  timestamp: number;
}

export function useTimedFetchStoredState<T>(
  key: string,
  fetch: () => Promise<T>,
  refreshRate: number,
): T | undefined {
  const [store, setStore] = useStoredState<TimestampedData<T> | undefined>(
    key,
    undefined,
  );

  useEffect(() => {
    const now = Date.now();
    const timeToRefresh = refreshRate - (now - (store?.timestamp ?? 0));
    if (!store?.timestamp || timeToRefresh <= 0) {
      console.log(`Fetching new '${key}'`);

      fetch().then(data => {
        setStore({ data, timestamp: Date.now() });
      });
    } else {
      console.log(
        `Retrieved '${key}' from local store, next refresh in ${timeToRefresh / 1000}s.`,
      );
    }
  }, []);

  return store?.data;
}
