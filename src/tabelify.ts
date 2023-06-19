import { Chalk, ChalkInstance } from 'chalk';
import { borderConfigs } from './borders.js';
import { stripAnsi } from './stripAnsi.js';
import { allKeysOf, distinct, isPrimitive } from './util.js';

const c: ChalkInstance = new Chalk();

type ColumnOptions<T> = {
  [k in keyof Partial<T>]: {
    headerOverride?: string;
    horizontalAlignment?: `${'left' | 'right' | 'center'}`;
    verticalAlignment?: `${'top' | 'bottom' | 'center'}`;
    formatter?: (value: T[k]) => string;
    showDiffToPrevious?: boolean;
  };
};

type TabelifyOptions = {
  rowDivider?: true;
  border?: keyof typeof borderConfigs;
  recurse?: true;
  indicies?: true;
};

type Cell<T> = {
  column: keyof T;
  content: string[];
  width: number;
  options: ColumnOptions<T>[keyof T];
};

export function tabelify<T, K extends keyof T>(
  data: T[],
  selector?: K[],
  config?: {
    columnOptions?: ColumnOptions<Pick<T, K>>;
    tabelifyOptions?: TabelifyOptions;
  },
): string {
  const { columnOptions, tabelifyOptions } = config || {};
  const hasPrimitives = data.some((item) => isPrimitive(item));

  // If no selector is provided, use all keys of all objects (distinct only) in the data array
  // as the selector.
  selector = selector || (distinct(allKeysOf(data)) as K[]);

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
        ? tabelify(value, undefined, { tabelifyOptions })
        : c.greenBright(`[Array(${defaultCellFormatter(value.length)})]`);
    }

    return tabelifyOptions?.recurse ? tabelify([value], undefined, { tabelifyOptions }) : c.cyanBright(`[Object]`);
  };

  const defaultHeaderFormatter = (value: any): string => {
    return c.magentaBright(value.toString());
  };

  // Build header
  const headerData: Cell<T>[] = selector.map((key) => {
    const options = columnOptions && columnOptions[key] ? columnOptions[key] : {};

    const header = options.headerOverride ? options.headerOverride : defaultHeaderFormatter(key);

    const column = key;
    const content = c.bold(header).split('\n');
    const width = Math.max(...content.map((line) => stripAnsi(line).length));

    return {
      column,
      content,
      width,
      options,
    };
  });

  // Build table
  const tableData: Cell<T>[][] = data.map((item) =>
    selector.map((key) => {
      const value = item[key];
      const options = columnOptions && columnOptions[key] ? columnOptions[key] : {};
      const formatter = options.formatter ? options.formatter : defaultCellFormatter;

      const cell = formatter(value);

      const column = key;
      const content = cell.split('\n');
      const width = Math.max(...content.map((line) => stripAnsi(line).length));

      return {
        column,
        content,
        width,
        options,
      };
    }),
  );

  const table = [headerData, ...tableData];

  // Add primitives
  if (hasPrimitives) {
    for (let i = 0; i < table.length; i++) {
      const row = table[i];
      const value =
        i == 0
          ? c.italic(defaultHeaderFormatter('[Value]'))
          : isPrimitive(data[i-1]) // Only style primitives, otherwise it might recurse Objects and overflow the stack
          ? defaultCellFormatter(data[i-1])
          : c.blackBright("╲");
      row.push({
        column: '#' as any,
        content: [value],
        width: stripAnsi(value).length,
        options: { horizontalAlignment: 'center' },
      });
    }
  }

  // Add indicies
  if (tabelifyOptions?.indicies) {
    for (let i = 0; i < table.length; i++) {
      const row = table[i];
      const value = i == 0 ? c.italic(defaultHeaderFormatter('[Index]')) : c.italic.blackBright(i - 1);
      row.unshift({
        column: '#' as any,
        content: [value],
        width: stripAnsi(value).length,
        options: { horizontalAlignment: 'center' },
      });
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
        const padAmount = cellPad - strippedLine.length + (strippedLine.match(/\u{308}/gmu)?.length ?? 0); // For each umlaut (diacritic), add one more space. Currently, only U+0308 is supported. (7̈ )

        if (horizontalAlignment === 'right') {
          cell.content[k] = ' '.repeat(padAmount) + line;
        } else if (horizontalAlignment === 'left') {
          cell.content[k] = line + ' '.repeat(padAmount);
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

  // Borders
  const {
    topLeftCorner,
    topRightCorner,
    bottomLeftCorner,
    bottomRightCorner,
    vertical,
    horizontal,
    verticalDownIntersection,
    verticalUpIntersection,
    horizontalRightIntersection,
    horizontalLeftIntersection,
    intersection,
  } = borderConfigs[tabelifyOptions?.border ?? 'rounded'];

  const horizontalBorder = columnWidths.map((width) => horizontal.repeat(width));
  const rowSeparator =
    horizontalRightIntersection + horizontalBorder.join(intersection) + horizontalLeftIntersection + '\n';

  let tableString = topLeftCorner + horizontalBorder.join(verticalDownIntersection) + topRightCorner + '\n';
  for (let i = 0; i < rowHeights[0]; i++) {
    tableString += `${vertical} ` + table[0].map((cell) => cell.content[i]).join(` ${vertical} `) + ` ${vertical}\n`;
  }
  tableString += rowSeparator;

  for (let i = 1; i < table.length; i++) {
    for (let j = 0; j < rowHeights[i]; j++) {
      tableString += `${vertical} ` + table[i].map((cell) => cell.content[j]).join(` ${vertical} `) + ` ${vertical}\n`;
    }

    if (tabelifyOptions?.rowDivider && i < table.length - 1) {
      tableString += rowSeparator;
    }
  }

  tableString += bottomLeftCorner + horizontalBorder.join(verticalUpIntersection) + bottomRightCorner;

  return tableString;
}

const sampleData = [
  { name: 'John', age: 24, city: 'New York\nYay!', country: 'USA' },
  { name: 'Jane', age: 18, city: 'London', country: 'UK' },
  { name: 'Bob', age: 32, city: 'Paris', country: 'France' },
  { name: 'Mary', age: 27, city: 'Berlin', country: [{ lol: 1 }, { kok: 2 }, { lol: 3 }] },
  { name: 'Mike', age: 41, city: 'Rome', country: { f: 1 } },
  { name: 'Lisa\nIs\nMy\nNaaaame!!!', age: 19, city: 'Madrid', country: () => 1 },
  { name: 'Tom', age: 23, city: 'Vienna', country: 123n },
  { name: 'Tim', age: 35, city: 'Athens', country: 'Greece' },
  { name: 'Kim', age: 29, city: 'Amsterdam', country: [null, null, undefined, null] },
  { name: 'Joe', age: 25, city: 'Brussels', country: 'Belgium' },
  { name: 'Ann', age: 31, city: 'Lisbon', country: 'Portugal' },
  { name: 'Sam', age: 33, city: 'Oslo', country: 'Norway' },
  { name: 'Kate', age: 28, city: 'Stockholm', country: 'Sweden' },
  { name: 'Carl', age: 30, city: 'Helsinki', country: 'Finland' },
  1 as any,
];

const out = tabelify(sampleData, ['name', 'age', 'city', 'country'], {
  columnOptions: {
    name: {
      headerOverride: c.blueBright('Name'),
    },
    age: {
      headerOverride: c.blueBright('Age'),
      horizontalAlignment: 'right',
    },
    country: {
      headerOverride: c.blueBright('Country'),
      horizontalAlignment: 'right',
    },
    city: {
      // titleOverride: c.blueBright('City'),
      horizontalAlignment: 'left',
    },
  },
  tabelifyOptions: {
    rowDivider: true,
    border: 'rounded',
    recurse: true,
    indicies: true,
  },
});

console.log(out);
