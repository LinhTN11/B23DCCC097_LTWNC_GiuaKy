import { useState, useEffect } from 'react';

/**
 * Custom hook generic debounce cho mọi kiểu dữ liệu T
 * @param value Giá trị cần debounce
 * @param delay Thời gian chờ (ms)
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
