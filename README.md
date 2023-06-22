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
      horizontalAlignment: 'right', // Align column to the right. Also supports 'left' and 'center'
      verticalAlignment: 'middle', // Align column to the middle. Also supports 'top' and 'bottom'
      formatter: (value, chalk) => chalk.red(value), // Format the value with chalk
    },
  },
});

console.log(out);
```
