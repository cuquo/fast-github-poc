import { cache } from 'react';

/**
 * Server store
 *
 * @param defaultValue - default value
 */
export default <T>(defaultValue: T): [() => T, (v: T) => void] => {
  const getRef = cache(() => ({ current: defaultValue }));

  /**
   * getValue from server slice
   */
  const getValue = (): T => getRef().current;

  /**
   * setValue to server slice
   *
   * @param value - new value
   */
  const setValue = (value: T): void => {
    getRef().current = value;
  };

  return [getValue, setValue];
};
