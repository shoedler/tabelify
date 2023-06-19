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
    alignment?: 'left' | 'right' | 'center';
    formatter?: (value: T[k]) => string;
    showDiffToPrevious?: boolean;
  };
};

type TabelifyOptions = {
  roundTo?: 1 | 0.1 | 0.01 | 0.001 | 0.0001 | 0.00001;
};

export function tabelify<T>(
  data: T[],
  selector: (keyof T)[],
  config?: {
    previousData?: T[];
    columnOptions?: ColumnOptions<T>;
    tabelifyOptions?: TabelifyOptions;
  },
): string {
  const { previousData, columnOptions } = config || {};

  //
  // Create data table from selector and mapped data
  const headerData: string[] = selector.map((key) => {
    const title =
      columnOptions && columnOptions[key] && columnOptions[key].titleOverride
        ? columnOptions[key].titleOverride
        : key.toString();
    return c.bold(title);
  });

  const tableData: string[][] = data.map((item, i) =>
    selector.map((key) => {
      const value = item[key];

      const previousValue = previousData && previousData.length > 0 ? previousData[i][key] : undefined;

      const showDiffToPrevious = columnOptions && columnOptions[key] && columnOptions[key].showDiffToPrevious;
      const addDiffRight = columnOptions && columnOptions[key] && columnOptions[key].alignment === 'right';
      const formatter =
        columnOptions && columnOptions[key] && columnOptions[key].formatter ? columnOptions[key].formatter : styleCell;

      if (showDiffToPrevious && previousValue !== undefined) {
        if (typeof value === 'number') {
          let diff = value - (previousValue as typeof value);
          if (diff === 0) {
            return formatter(value);
          }
          diff = Math.round(diff * 10) / 10;
          return addDiffRight ? `${formatter(value)} (${c.black(diff)})` : `(${c.black(diff)}) ${formatter(value)}`;
        }
        if (typeof value === 'string') {
          const diff = previousValue as typeof value;
          return `${formatter(value)} (${c.black('was ' + diff)})`;
        } else {
          return `${formatter(value)} (${c.black('changed')})`;
        }
      }

      return formatter(value);
    }),
  );

  const table = [headerData, ...tableData];

  //
  // Find the longest cell in each column
  const columnWidths = new Array(selector.length).fill(0);
  const rowHeights = new Array(table.length).fill(0);

  for (let i = 0; i < table.length; i++) {
    const row = table[i];
    for (let j = 0; j < row.length; j++) {
      const cell = row[j];
      const strippedCell = stripAnsi(cell);
      columnWidths[j] = Math.max(columnWidths[j], strippedCell.length);
      rowHeights[i] = Math.max(rowHeights[i], cell.split('\n').length);
    }
  }

  //
  // Normalize table by padding each cell with spaces
  const normalizedTable = table.map((row) => {
    return row.map((cell, i) => {
      const strippedCell = stripAnsi(cell);
      let padAmount = columnWidths[i] - strippedCell.length;

      // For each umlaut (diacritic), add one more space. Currently, only U+0308 is supported. (7̈ )
      const umlauts = strippedCell.match(/\u{308}/gmu);
      if (umlauts) {
        padAmount += umlauts.length;
      }

      const alignment =
        columnOptions && columnOptions[selector[i]] && columnOptions[selector[i]].alignment
          ? columnOptions[selector[i]].alignment
          : 'left';

      let padded = '';

      if (alignment === 'right') {
        padded = ' '.repeat(padAmount) + cell;
      } else if (alignment === 'left') {
        padded = cell + ' '.repeat(padAmount);
      } else {
        // Center
        const leftPad = Math.floor(padAmount / 2);
        const rightPad = Math.ceil(padAmount / 2);

        padded = ' '.repeat(leftPad) + cell + ' '.repeat(rightPad);
      }

      padded += ' '.repeat(rowHeights[i] - cell.split('\n').length);

      return padded;
    });
  });

  //
  // Borders
  const horizontalBorder = columnWidths.map((width) => '-'.repeat(width));

  let tableString = '+-' + horizontalBorder.join('-+-') + '-+\n';
  tableString += '| ' + normalizedTable[0].join(' | ') + ' |\n';
  tableString += '+-' + horizontalBorder.join('-+-') + '-+\n';

  for (let i = 1; i < normalizedTable.length; i++) {
    tableString += '| ' + normalizedTable[i].join(' | ') + ' |\n';
  }

  tableString += '+-' + horizontalBorder.join('-+-') + '-+\n';

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
  { name: 'John', age: 24, city: 'New York', country: 'USA' },
  { name: 'Jane', age: 18, city: 'London', country: 'UK' },
  { name: 'Bob', age: 32, city: 'Paris', country: 'France' },
  { name: 'Mary', age: 27, city: 'Berlin', country: 'Germany' },
  { name: 'Mike', age: 41, city: 'Rome', country: 'Italy' },
  { name: 'Lisa', age: 19, city: 'Madrid', country: 'Spain' },
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
    age: {
      alignment: 'right',
    },
    country: {
      alignment: 'center',
    },
  },
});

console.log(out);
