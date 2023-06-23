import { Chalk } from 'chalk';
import { TabelifyOptions, tabelify } from './tabelify.js';

const chalk = new Chalk();

export const provideDefaultFormatters = (tabelifyOptions: TabelifyOptions) => {
  const defaultCellFormatter = (value: any): string => {
    if (typeof value === 'string') {
      return value;
    }
    if (value === null) {
      return chalk.italic.gray('null');
    }

    if (typeof value === 'undefined') {
      return chalk.italic.gray('undef');
    }
    if (typeof value === 'number') {
      return chalk.yellowBright(value.toString());
    }
    if (typeof value === 'bigint') {
      return chalk.yellowBright(value.toString() + 'n');
    }
    if (typeof value === 'boolean') {
      return chalk.blueBright(value.toString());
    }
    if (typeof value === 'function') {
      return chalk.magentaBright(`[Function]`);
    }
    if (Array.isArray(value)) {
      return tabelifyOptions?.recurse
        ? tabelify(value, { tabelifyOptions })
        : chalk.greenBright(`[Array(${defaultCellFormatter(value.length)})]`);
    }

    return tabelifyOptions?.recurse ? tabelify([value], { tabelifyOptions }) : chalk.cyanBright(`[Object]`);
  };

  const defaultHeaderFormatter = (value: any): string => {
    return chalk.magentaBright(value.toString());
  };

  const internalCellFormatter = (value: any): string => {
    return chalk.italic.blackBright(value);
  };

  const internalHeaderFormatter = (value: any): string => {
    return chalk.italic(defaultHeaderFormatter(value));
  };

  const internalCellWithoutValueFormatter = (): string => {
    return internalCellFormatter('─');
  };

  return {
    cell: defaultCellFormatter,
    header: defaultHeaderFormatter,
    internalCell: internalCellFormatter,
    internalCellWithoutValue: internalCellWithoutValueFormatter,
    internalHeader: internalHeaderFormatter,
  };
};
