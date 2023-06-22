import { Chalk } from 'chalk';
import { tabelify } from './tabelify.js';

const chalk = new Chalk();

// Samples from README.md

const basic = () => {
  const data = [
    { name: 'John', age: 24, city: 'New York' },
    { name: 'Jane', age: 23, city: 'London' },
    { name: 'Jack', age: 25, city: 'Paris' },
  ];

  // console.log(tabelify(data));

  return tabelify(data);
};

const advanced = () => {
  const data = [
    { name: 'John', age: 24, city: 'New York' },
    { name: 'Jane', age: 23, city: 'London' },
    { name: 'Jack', age: 25, city: [1, 2, 3, 4] },
  ];

  const out = tabelify(data, {
    selector: ['name', 'age'], // Only display name and age
    tabelifyOptions: {
      rowDivider: true, // Add a divider between rows
      border: 'single', // Add a border around the table. Also supports 'double', 'rounded', 'bold' and 'ascii'
      recurse: true, // Recurse into objects and arrays
      indices: true, // Add a column with indices
    },
    columnOptions: {
      age: {
        headerOverride: 'Age', // Override the header name
        horizontalAlignment: 'right', // Align column to the right. Also supports 'left' and 'middle'
        verticalAlignment: 'center', // Align column to the center. Also supports 'top' and 'bottom'
        formatter: (value, chalk) => chalk.red(value), // Format the value with chalk
      },
    },
  });

  // console.log(out);

  return out;
};

const mixed = () => {
  const out = tabelify(
    [
      { name: 'John', age: 24, city: 'New York\nYay!', country: 'USA' },
      { name: 'Mary', age: 27, city: 'Berlin', country: [{ lol: 1 }, { foo: 2 }, { bar: 3 }] },
      { name: 'Mike', age: 41, city: 'Rome', country: { f: 1 } },
      { name: 'Lisa\nMartinez\nValencia\nVeloquez', age: 19, city: 'Madrid', country: () => 1 },
      { name: 'Tom', age: 23, city: 'Vienna', country: 123n },
      { name: 'Kim', age: 29, city: 'Amsterdam', country: [null, undefined] },
      1 as any,
    ],
    {
      selector: ['name', 'age', 'city', 'country'],
      columnOptions: {
        name: {
          headerOverride: chalk.bold.magentaBright('Name'),
        },
        age: {
          headerOverride: chalk.bold.magentaBright('Age'),
          horizontalAlignment: 'right',
        },
        country: {
          headerOverride: chalk.bold.magentaBright('Country'),
          horizontalAlignment: 'right',
        },
        city: {
          headerOverride: chalk.bold.magentaBright('City'),
          horizontalAlignment: 'left',
        },
      },
      tabelifyOptions: {
        rowDivider: true,
        border: 'rounded',
        recurse: true,
        indices: true,
      },
    },
  );

  // console.log(out);

  return out;
};

[basic(), advanced(), mixed()].forEach((out) => {
  console.log('\n'.repeat(5));
  console.log(
    out
      .split('\n')
      .map((line) => ' '.repeat(10) + line)
      .join('\n'),
  );
  console.log('\n'.repeat(5));
});
