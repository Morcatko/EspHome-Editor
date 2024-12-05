import * as equal from 'fast-deep-equal';

export const isEqual = (objA: unknown, objB: unknown): boolean => {
  return equal(objA, objB);
};

export const isArray = (item: unknown): item is unknown[] => {
  return Array.isArray(item);
};

// https://github.com/reduxjs/redux/blob/master/src/utils/isPlainObject.ts
export const isPlainObject = (item: unknown): item is Record<string, unknown> => {
  if (typeof item !== 'object' || item === null) {
    return false;
  }

  let proto = item;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(item) === proto;
};

export const isNumber = (item: unknown): item is number => {
  return typeof item === 'number';
};

export const isString = (item: unknown): item is string => {
  return typeof item === 'string';
};

export const isUndefined = <T extends unknown>(item: T | undefined): item is undefined => {
  return typeof item === 'undefined';
};

export const isDefined = <T extends unknown>(item: T): item is Exclude<typeof item, undefined> => {
  return typeof item !== 'undefined';
};
