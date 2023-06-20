import { Chalk } from 'chalk';
import { TabelifyOptions, tabelify } from './tabelify.js';

const c = new Chalk();

export const provideDefaultFormatters = (tabelifyOptions: TabelifyOptions) => {
  const defaultCellFormatter = (value: any): string => {
    if (typeof value === 'string') {
      return value;
    }
    if (value === null) {
      return c.italic.black('null');
    }

    if (typeof value === 'undefined') {
      return c.italic.black('undef');
    }
    if (typeof value === 'number') {
      return c.yellowBright(value.toString());
    }
    if (typeof value === 'bigint') {
      return c.yellowBright(value.toString() + 'n');
    }
    if (typeof value === 'boolean') {
      return c.blueBright(value.toString());
    }
    if (typeof value === 'function') {
      return c.magentaBright(`[Function]`);
    }
    if (Array.isArray(value)) {
      return tabelifyOptions?.recurse
        ? tabelify(value, { tabelifyOptions })
        : c.greenBright(`[Array(${defaultCellFormatter(value.length)})]`);
    }

    return tabelifyOptions?.recurse ? tabelify([value], { tabelifyOptions }) : c.cyanBright(`[Object]`);
  };

  const defaultHeaderFormatter = (value: any): string => {
    return c.magentaBright(value.toString());
  };

  const internalCellFormatter = (value: any): string => {
    return c.italic.blackBright(value);
  };

  const internalHeaderFormatter = (value: any): string => {
    return c.italic(defaultHeaderFormatter(value));
  };

  return {
    cell: defaultCellFormatter,
    header: defaultHeaderFormatter,
    internalCell: internalCellFormatter,
    internalHeader: internalHeaderFormatter,
  };
};
