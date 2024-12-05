import { parseInternal } from '../parser/parse';
import { Handler } from './Handler';
import { isArray, isDefined, isUndefined } from './helper';

export type QueryOptions = {
  hideExceptions?: boolean;
  returnArray?: boolean;
};

const querySingle = (payload: unknown, path: string, options: QueryOptions): unknown => {
  const tree = parseInternal(path);

  const handler = new Handler(payload);
  const result = handler.handleRoot(tree);

  if (!result?.isIndefinite && options.returnArray) {
    if (isUndefined(result)) {
      return [];
    }
    return [result.value];
  }

  return result?.value;
};

const queryMany = (payload: unknown, paths: string[], options: QueryOptions): unknown => {
  const results: unknown[] = [];
  for (const path of paths) {
    const res = querySingle(payload, path, options);
    if (isDefined(res)) {
      results.push(res);
    }
  }
  return results;
};

export const query = (payload: unknown, paths: string | string[], options: QueryOptions = {}): unknown => {
  try {
    if (isArray(paths)) {
      return queryMany(payload, paths, options);
    }
    return querySingle(payload, paths, options);
  } catch (e) {
    if (!options.hideExceptions) {
      throw e;
    }

    if (!!options.returnArray) {
      return [];
    }
    return;
  }
};
