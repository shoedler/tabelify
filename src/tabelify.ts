import { Chalk, ChalkInstance } from 'chalk';
import { BorderConfig, provideBorderConfig } from './borders.js';
import { provideDefaultFormatters } from './formatters.js';
import { stripAnsi } from './stripAnsi.js';
import { allKeysOf, getUmlautCount as countUmlauts, distinct, isPrimitive } from './util.js';

const chalk: ChalkInstance = new Chalk();

export type ColumnOptions<T> = {
  [k in keyof Partial<T>]: {
    headerOverride?: string;
    horizontalAlignment?: `${'left' | 'right' | 'center'}`;
    verticalAlignment?: `${'top' | 'bottom' | 'center'}`;
    formatter?: (value: T[k], chalk: ChalkInstance) => string;
  };
};

export type TabelifyOptions = {
  rowDivider?: true;
  border?: BorderConfig;
  recurse?: true;
  indices?: true;
};

type Cell<T> = {
  content: string[];
  width: number;
  options: ColumnOptions<T>[keyof T];
};

export function tabelify<T, K extends keyof T>(
  data: T[],
  config?: {
    selector?: K[];
    columnOptions?: ColumnOptions<Pick<T, K>>;
    tabelifyOptions?: TabelifyOptions;
  },
): string {
  const { columnOptions, tabelifyOptions } = config || {};

  // Even tough this library is intended for arrays of objects, it should also work with arrays of primitives.
  // If there are any primitives, we'll add a separate column for them.
  const hasPrimitives = data.some((item) => isPrimitive(item));

  // If no selector is provided, use all keys of all objects (distinct only) in the data array as the selector.
  const selector = config?.selector || (distinct(allKeysOf(data)) as K[]);

  const defaultFormatters = provideDefaultFormatters(tabelifyOptions);
  const borderConfig = provideBorderConfig(tabelifyOptions?.border ?? 'rounded');

  const createCell = (result: string, options: ColumnOptions<Pick<T, K>>[K]) => {
    const content = result.split('\n');
    const width = Math.max(...content.map((line) => stripAnsi(line).length));

    return {
      content,
      width,
      options,
    };
  };

  // Build header
  const headerData: Cell<T>[] = selector.map((key) => {
    const options = columnOptions && columnOptions[key] ? columnOptions[key] : {};
    const header = options.headerOverride ? options.headerOverride : defaultFormatters.header(key);

    return createCell(chalk.bold(header), options);
  });

  // Build table
  const tableData: Cell<T>[][] = data.map((item) =>
    selector.map((key) => {
      const options = columnOptions && columnOptions[key] ? columnOptions[key] : {};
      const formatter = options.formatter ? options.formatter : defaultFormatters.cell;
      const cell = isPrimitive(item) ? defaultFormatters.internalCell('─') : formatter(item[key], chalk);

      return createCell(cell, options);
    }),
  );

  const table = [headerData, ...tableData];

  // Add primitives
  if (hasPrimitives) {
    for (let i = 0; i < table.length; i++) {
      const row = table[i];
      const value =
        i == 0
          ? defaultFormatters.internalHeader('[Value]')
          : isPrimitive(data[i - 1]) || Array.isArray(data[i - 1]) // Only style primitives, otherwise it might recurse Objects and overflow the stack
          ? defaultFormatters.cell(data[i - 1])
          : defaultFormatters.internalCell('─');
      const cell = createCell(value, { horizontalAlignment: 'center' });

      row.push(cell);
    }
  }

  // Add indicies
  if (tabelifyOptions?.indices) {
    for (let i = 0; i < table.length; i++) {
      const row = table[i];
      const value = i == 0 ? defaultFormatters.internalHeader('[Index]') : defaultFormatters.internalCell(i - 1);
      const cell = createCell(value, { horizontalAlignment: 'center' });

      row.unshift(cell);
    }
  }

  // Calculate column widths and row heights
  const columnWidths = new Array(table[0].length).fill(0);
  const rowHeights = new Array(table.length).fill(0);

  for (let i = 0; i < table.length; i++) {
    const row = table[i];
    for (let j = 0; j < row.length; j++) {
      const cell = row[j];
      columnWidths[j] = Math.max(columnWidths[j], cell.width);
      rowHeights[i] = Math.max(rowHeights[i], cell.content.length);
    }
  }

  // Normalize table by padding each cell with spaces and newlines
  for (let i = 0; i < table.length; i++) {
    const row = table[i];
    for (let j = 0; j < row.length; j++) {
      const cell = row[j];
      const cellPad = columnWidths[j];
      const verticalAlignment = cell.options.verticalAlignment ?? 'center';
      const horizontalAlignment = cell.options.horizontalAlignment ?? 'center';

      // Pad cell horizontally
      for (let k = 0; k < cell.content.length; k++) {
        const line = cell.content[k];
        const strippedLine = stripAnsi(line);

        // Patch umlauts: For each umlaut (diacritic), add one space.
        const padAmount = cellPad - strippedLine.length + countUmlauts(strippedLine);

        if (horizontalAlignment === 'right' || horizontalAlignment === 'left') {
          const padding = ' '.repeat(padAmount);

          cell.content[k] = horizontalAlignment === 'right' ? padding + line : line + padding;
        } else {
          const leftPad = Math.floor(padAmount / 2);
          const rightPad = Math.ceil(padAmount / 2);

          cell.content[k] = ' '.repeat(leftPad) + line + ' '.repeat(rightPad);
        }
      }

      // Pad cell vertically
      if (verticalAlignment === 'top' || verticalAlignment === 'bottom') {
        const emptyLines = new Array(rowHeights[i] - cell.content.length).fill(' '.repeat(cellPad));

        cell.content =
          verticalAlignment === 'top' ? [...cell.content, ...emptyLines] : [...emptyLines, ...cell.content];
      } else {
        const topPad = Math.floor((rowHeights[i] - cell.content.length) / 2);
        const bottomPad = Math.ceil((rowHeights[i] - cell.content.length) / 2);

        cell.content = [
          ...new Array(topPad).fill(' '.repeat(cellPad)),
          ...cell.content,
          ...new Array(bottomPad).fill(' '.repeat(cellPad)),
        ];
      }
    }
  }

  // Build table string
  // Header border
  const horizontalBorder = columnWidths.map((width) => borderConfig.horizontal.repeat(width));
  const rowSeparator =
    borderConfig.horizontalRightIntersection +
    horizontalBorder.join(borderConfig.intersection) +
    borderConfig.horizontalLeftIntersection +
    '\n';

  // Top border
  let tableString =
    borderConfig.topLeftCorner +
    horizontalBorder.join(borderConfig.verticalDownIntersection) +
    borderConfig.topRightCorner +
    '\n';

  // Header
  for (let i = 0; i < rowHeights[0]; i++) {
    tableString +=
      `${borderConfig.vertical} ` +
      table[0].map((cell) => cell.content[i]).join(` ${borderConfig.vertical} `) +
      ` ${borderConfig.vertical}\n`;
  }

  // Header separator
  tableString += rowSeparator;

  // Body
  for (let i = 1; i < table.length; i++) {
    for (let j = 0; j < rowHeights[i]; j++) {
      tableString +=
        `${borderConfig.vertical} ` +
        table[i].map((cell) => cell.content[j]).join(` ${borderConfig.vertical} `) +
        ` ${borderConfig.vertical}\n`;
    }

    // Row separator
    if (tabelifyOptions?.rowDivider && i < table.length - 1) {
      tableString += rowSeparator;
    }
  }

  // Bottom border
  tableString +=
    borderConfig.bottomLeftCorner +
    horizontalBorder.join(borderConfig.verticalUpIntersection) +
    borderConfig.bottomRightCorner;

  return tableString;
}
