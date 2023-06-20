import { stripAnsi } from '../src/stripAnsi';
import { tabelify } from '../src/tabelify';

describe(tabelify.name + ' Fuzzy Tests', () => {
  it('should work with mixed data', () => {
    // Arrange
    const cleanedExpected =
      '╭─────────┬────────────┬───────┬───────────┬─────────────────────────────┬─────────╮\n' +
      '│ [Index] │    Name    │   Age │ City      │                     Country │ [Value] │\n' +
      '├─────────┼────────────┼───────┼───────────┼─────────────────────────────┼─────────┤\n' +
      '│    0    │    John    │    24 │ New York  │                         USA │    ╲    │\n' +
      '│         │            │       │ Yay!      │                             │         │\n' +
      '├─────────┼────────────┼───────┼───────────┼─────────────────────────────┼─────────┤\n' +
      '│    1    │    Jane    │    18 │ London    │                          UK │    ╲    │\n' +
      '├─────────┼────────────┼───────┼───────────┼─────────────────────────────┼─────────┤\n' +
      '│    2    │    Bob     │    32 │ Paris     │                      France │    ╲    │\n' +
      '├─────────┼────────────┼───────┼───────────┼─────────────────────────────┼─────────┤\n' +
      '│         │            │       │           │ ╭─────────┬───────┬───────╮ │         │\n' +
      '│         │            │       │           │ │ [Index] │  lol  │  kok  │ │         │\n' +
      '│         │            │       │           │ ├─────────┼───────┼───────┤ │         │\n' +
      '│         │            │       │           │ │    0    │   1   │ undef │ │         │\n' +
      '│    3    │    Mary    │    27 │ Berlin    │ ├─────────┼───────┼───────┤ │    ╲    │\n' +
      '│         │            │       │           │ │    1    │ undef │   2   │ │         │\n' +
      '│         │            │       │           │ ├─────────┼───────┼───────┤ │         │\n' +
      '│         │            │       │           │ │    2    │   3   │ undef │ │         │\n' +
      '│         │            │       │           │ ╰─────────┴───────┴───────╯ │         │\n' +
      '├─────────┼────────────┼───────┼───────────┼─────────────────────────────┼─────────┤\n' +
      '│         │            │       │           │             ╭─────────┬───╮ │         │\n' +
      '│         │            │       │           │             │ [Index] │ f │ │         │\n' +
      '│    4    │    Mike    │    41 │ Rome      │             ├─────────┼───┤ │    ╲    │\n' +
      '│         │            │       │           │             │    0    │ 1 │ │         │\n' +
      '│         │            │       │           │             ╰─────────┴───╯ │         │\n' +
      '├─────────┼────────────┼───────┼───────────┼─────────────────────────────┼─────────┤\n' +
      '│         │    Lisa    │       │           │                             │         │\n' +
      '│    5    │     Is     │    19 │ Madrid    │                  [Function] │    ╲    │\n' +
      '│         │     My     │       │           │                             │         │\n' +
      '│         │ Naaaame!!! │       │           │                             │         │\n' +
      '├─────────┼────────────┼───────┼───────────┼─────────────────────────────┼─────────┤\n' +
      '│    6    │    Tom     │    23 │ Vienna    │                        123n │    ╲    │\n' +
      '├─────────┼────────────┼───────┼───────────┼─────────────────────────────┼─────────┤\n' +
      '│    7    │    Tim     │    35 │ Athens    │                      Greece │    ╲    │\n' +
      '├─────────┼────────────┼───────┼───────────┼─────────────────────────────┼─────────┤\n' +
      '│         │            │       │           │       ╭─────────┬─────────╮ │         │\n' +
      '│         │            │       │           │       │ [Index] │ [Value] │ │         │\n' +
      '│         │            │       │           │       ├─────────┼─────────┤ │         │\n' +
      '│         │            │       │           │       │    0    │  null   │ │         │\n' +
      '│         │            │       │           │       ├─────────┼─────────┤ │         │\n' +
      '│    8    │    Kim     │    29 │ Amsterdam │       │    1    │  null   │ │    ╲    │\n' +
      '│         │            │       │           │       ├─────────┼─────────┤ │         │\n' +
      '│         │            │       │           │       │    2    │  undef  │ │         │\n' +
      '│         │            │       │           │       ├─────────┼─────────┤ │         │\n' +
      '│         │            │       │           │       │    3    │  null   │ │         │\n' +
      '│         │            │       │           │       ╰─────────┴─────────╯ │         │\n' +
      '├─────────┼────────────┼───────┼───────────┼─────────────────────────────┼─────────┤\n' +
      '│    9    │    Joe     │    25 │ Brussels  │                     Belgium │    ╲    │\n' +
      '├─────────┼────────────┼───────┼───────────┼─────────────────────────────┼─────────┤\n' +
      '│   10    │    Ann     │    31 │ Lisbon    │                    Portugal │    ╲    │\n' +
      '├─────────┼────────────┼───────┼───────────┼─────────────────────────────┼─────────┤\n' +
      '│   11    │    Sam     │    33 │ Oslo      │                      Norway │    ╲    │\n' +
      '├─────────┼────────────┼───────┼───────────┼─────────────────────────────┼─────────┤\n' +
      '│   12    │    Kate    │    28 │ Stockholm │                      Sweden │    ╲    │\n' +
      '├─────────┼────────────┼───────┼───────────┼─────────────────────────────┼─────────┤\n' +
      '│   13    │    Carl    │    30 │ Helsinki  │                     Finland │    ╲    │\n' +
      '├─────────┼────────────┼───────┼───────────┼─────────────────────────────┼─────────┤\n' +
      '│   14    │   undef    │ undef │ undef     │                       undef │    1    │\n' +
      '╰─────────┴────────────┴───────┴───────────┴─────────────────────────────┴─────────╯';

    // Act
    const result = tabelify(sampleData, {
      selector: ['name', 'age', 'city', 'country'],
      columnOptions: {
        name: {
          headerOverride: 'Name',
        },
        age: {
          headerOverride: 'Age',
          horizontalAlignment: 'right',
        },
        country: {
          headerOverride: 'Country',
          horizontalAlignment: 'right',
        },
        city: {
          headerOverride: 'City',
          horizontalAlignment: 'left',
        },
      },
      tabelifyOptions: {
        rowDivider: true,
        border: 'rounded',
        recurse: true,
        indices: true,
      },
    });
    const cleanedResult = stripAnsi(result);

    console.log(cleanedResult);

    // Assert
    expect(cleanedResult).toEqual(cleanedExpected);
  });
});

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
