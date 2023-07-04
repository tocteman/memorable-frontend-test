import { useCallback, useState } from "react";

const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,}|)Z$/;
const reviver = (key: string, value: unknown) => {
  if (typeof value === "string" && dateFormat.test(value)) {
    return new Date(value);
  }
  return value;
};

export const useStorage = <T>(
  key: string,
  defaultValue: T,
): [T, (value: T) => void] => {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored, reviver) as T;
      } catch (err) {
        // Do nothing
      }
    }
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  });

  const set = useCallback(
    (value: T) => {
      localStorage.setItem(key, JSON.stringify(value));
      setValue(value);
    },
    [key],
  );

  return [value, set];
};
