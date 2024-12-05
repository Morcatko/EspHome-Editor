import { parseInternal } from '../parser/parse';
import { Handler } from './Handler';
import { isArray, isUndefined } from './helper';

export type PathsOptions = {
  hideExceptions?: boolean;
};

export const paths = (payload: unknown, path: string, options: PathsOptions = {}): string[] => {
  try {
    const tree = parseInternal(path);

    const handler = new Handler(payload);
    const result = handler.handleRoot(tree);

    if (isUndefined(result)) {
      return [];
    }

    if (!isArray(result.paths)) {
      return [result.paths];
    }
    return result.paths;
  } catch (e) {
    if (!options.hideExceptions) {
      throw e;
    }
    return [];
  }
};
