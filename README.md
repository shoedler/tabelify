# tabelify

Nicely display data as tables in the terminal.
Only one dependency: [chalk](https://github.com/chalk/chalk) to colorize the output.

## Installation

```bash
npm i tabelify
```

## Basic Usage

```javascript
import tabelify from 'tabelify';

const data = [
  { name: 'John', age: 24, city: 'New York' },
  { name: 'Jane', age: 23, city: 'London' },
  { name: 'Jack', age: 25, city: 'Paris' },
];

console.log(tabelify(data));
```

![image](https://github.com/shoedler/tabelify/assets/38029550/700d12ba-208d-450d-a607-140351a87070)

## Advanced Usage

Here's and example with all the options configured:

```typescript
import tabelify from 'tabelify';

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

console.log(out);
```

![image](https://github.com/shoedler/tabelify/assets/38029550/bc8d5404-e02d-4e20-9a1c-4934868edf67)

Here's an example with mixed data:

```typescript
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
        headerOverride: c.bold.magentaBright('Name'),
      },
      age: {
        headerOverride: c.bold.magentaBright('Age'),
        horizontalAlignment: 'right',
      },
      country: {
        headerOverride: c.bold.magentaBright('Country'),
        horizontalAlignment: 'right',
      },
      city: {
        headerOverride: c.bold.magentaBright('City'),
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

console.log(out);
```

![image](https://github.com/shoedler/tabelify/assets/38029550/56510276-e964-4c01-bf89-97bba549ea03)
