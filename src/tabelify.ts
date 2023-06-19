import { Chalk, ChalkInstance } from 'chalk';

const c: ChalkInstance = new Chalk();

const ansiRegexPattern = [
  '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
  '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))',
].join('|');

const ansiRegex = new RegExp(ansiRegexPattern, 'g');

const stripAnsi = (text: string) => text.replace(ansiRegex, '');

type ColumnOptions<T> = {
  [k in keyof Partial<T>]: {
    titleOverride?: string;
    horizontalAlignment?: `${'left' | 'right' | 'center'}`;
    verticalAlignment?: `${'top' | 'bottom' | 'center'}`;
    formatter?: (value: T[k]) => string;
    showDiffToPrevious?: boolean;
  };
};

type TabelifyOptions = {
  rowDivider?: true;
};

type Cell<T> = {
  column: keyof T;
  content: string[];
  width: number;
  options: ColumnOptions<T>[keyof T];
};

export function tabelify<T, K extends keyof T>(
  data: T[],
  selector: K[],
  config?: {
    columnOptions?: ColumnOptions<Pick<T, K>>;
    tabelifyOptions?: TabelifyOptions;
  },
): string {
  const { columnOptions, tabelifyOptions } = config || {};

  // Build header
  const headerData: Cell<T>[] = selector.map((key) => {
    const options = columnOptions && columnOptions[key] ? columnOptions[key] : {};

    const title = options.titleOverride ? options.titleOverride : key.toString();

    const column = key;
    const content = c.bold(title).split('\n');
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
      const formatter = options.formatter ? options.formatter : styleCell;

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

  // Calculate column widths and row heights
  const columnWidths = new Array(selector.length).fill(0);
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
  const horizontalBorder = columnWidths.map((width) => '-'.repeat(width));

  let tableString = '+-' + horizontalBorder.join('-+-') + '-+\n';
  for (let i = 0; i < rowHeights[0]; i++) {
    tableString += '| ' + table[0].map((cell) => cell.content[i]).join(' | ') + ' |\n';
  }
  tableString += '+-' + horizontalBorder.join('-+-') + '-+\n';

  for (let i = 1; i < table.length; i++) {
    for (let j = 0; j < rowHeights[i]; j++) {
      tableString += '| ' + table[i].map((cell) => cell.content[j]).join(' | ') + ' |\n';
    }

    if (tabelifyOptions?.rowDivider) {
      tableString += '+-' + horizontalBorder.join('-+-') + '-+\n';
    }
  }

  if (!tabelifyOptions?.rowDivider) {
    tableString += '+-' + horizontalBorder.join('-+-') + '-+\n';
  }

  return tableString;
}

const styleCell = (value: any): string => {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number') {
    return c.yellowBright(value.toString());
  }
  if (typeof value === 'boolean') {
    return c.blueBright(value.toString());
  }
  if (Array.isArray(value)) {
    return c.greenBright(`[Array(${styleCell(value.length)})]`);
  }

  return c.cyanBright(`[Object]`);
};

const sampleData = [
  { name: 'John', age: 24, city: 'New York\nYay!', country: 'USA' },
  { name: 'Jane', age: 18, city: 'London', country: 'UK' },
  { name: 'Bob', age: 32, city: 'Paris', country: 'France' },
  { name: 'Mary', age: 27, city: 'Berlin', country: [0] },
  { name: 'Mike', age: 41, city: 'Rome', country: {} },
  { name: 'Lisa\nIs\nMy\nNaaaame!!!', age: 19, city: 'Madrid', country: 'Spain' },
  { name: 'Tom', age: 23, city: 'Vienna', country: 'Austria' },
  { name: 'Tim', age: 35, city: 'Athens', country: 'Greece' },
  { name: 'Kim', age: 29, city: 'Amsterdam', country: 'Netherlands' },
  { name: 'Joe', age: 25, city: 'Brussels', country: 'Belgium' },
  { name: 'Ann', age: 31, city: 'Lisbon', country: 'Portugal' },
  { name: 'Sam', age: 33, city: 'Oslo', country: 'Norway' },
  { name: 'Kate', age: 28, city: 'Stockholm', country: 'Sweden' },
  { name: 'Carl', age: 30, city: 'Helsinki', country: 'Finland' },
];

const out = tabelify(sampleData, ['name', 'age', 'city', 'country'], {
  columnOptions: {
    name: {
      titleOverride: c.blueBright('Name'),
    },
    age: {
      titleOverride: c.blueBright('Age'),
      horizontalAlignment: 'right',
    },
    country: {
      titleOverride: c.blueBright('Country'),
      horizontalAlignment: 'center',
    },
    city: {
      titleOverride: c.blueBright('City'),
      horizontalAlignment: 'left',
    },
  },
  tabelifyOptions: {
    rowDivider: true,
  },
});

console.log(out);
