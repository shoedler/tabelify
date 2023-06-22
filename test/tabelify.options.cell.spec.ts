import { stripAnsi } from '../src/stripAnsi.js';
import { tabelify } from '../src/tabelify.js';

describe(tabelify.name + ' TabelifyOptions.columnOptions', () => {
  it('should override the header', () => {
    // Arrange
    const data = [{ a: 1 }, { a: 2 }, { a: 3 }];
    const cleanedExpected =
      '╭─────────╮\n' +
      '│ Foobar! │\n' +
      '├─────────┤\n' +
      '│    1    │\n' +
      '│    2    │\n' +
      '│    3    │\n' +
      '╰─────────╯';

    // Act
    const result = tabelify(data, { columnOptions: { a: { headerOverride: 'Foobar!' } } });
    const cleanedResult = stripAnsi(result);

    // Assert
    expect(cleanedResult).toEqual(cleanedExpected);
  });

  it('should apply a custom formatter', () => {
    // Arrange
    const data = [{ Whatsup: 1 }, { Whatsup: 2 }, { Whatsup: 3 }];
    const cleanedExpected =
      '╭─────────╮\n' +
      '│ Whatsup │\n' +
      '├─────────┤\n' +
      '│    2    │\n' +
      '│    3    │\n' +
      '│    4    │\n' +
      '╰─────────╯';

    // Act
    const result = tabelify(data, { columnOptions: { Whatsup: { formatter: (v) => (v + 1).toString() } } });
    const cleanedResult = stripAnsi(result);

    // Assert
    expect(cleanedResult).toEqual(cleanedExpected);
  });

  it('should align cell contents horizontally', () => {
    // Arrange
    const data = [
      { left: 1, right: 2, center: 3 },
      { left: 4, right: 5, center: 6 },
      { left: 7, right: 8, center: 9 },
    ];
    const cleanedExpected =
      '╭──────┬───────┬────────╮\n' +
      '│ left │ right │ center │\n' +
      '├──────┼───────┼────────┤\n' +
      '│ 1    │     2 │   3    │\n' +
      '│ 4    │     5 │   6    │\n' +
      '│ 7    │     8 │   9    │\n' +
      '╰──────┴───────┴────────╯';

    // Act
    const result = tabelify(data, {
      columnOptions: {
        left: { horizontalAlignment: 'left' },
        right: { horizontalAlignment: 'right' },
        center: { horizontalAlignment: 'center' },
      },
    });
    const cleanedResult = stripAnsi(result);

    // Assert
    expect(cleanedResult).toEqual(cleanedExpected);
  });

  it('should align cell contents vertically', () => {
    // Arrange
    const data = [
      { top: 1, bottom: 2, middle: 3, ignore: 'Foo\nBar\nBaz' },
      { top: 4, bottom: 5, middle: 6, ignore: 'Foo\nBar\nBaz' },
      { top: 7, bottom: 8, middle: 9, ignore: 'Foo\nBar\nBaz' },
    ];
    const cleanedExpected =
      '╭─────┬────────┬────────┬────────╮\n' +
      '│ top │ bottom │ middle │ ignore │\n' +
      '├─────┼────────┼────────┼────────┤\n' +
      '│  1  │        │        │  Foo   │\n' +
      '│     │        │   3    │  Bar   │\n' +
      '│     │   2    │        │  Baz   │\n' +
      '├─────┼────────┼────────┼────────┤\n' +
      '│  4  │        │        │  Foo   │\n' +
      '│     │        │   6    │  Bar   │\n' +
      '│     │   5    │        │  Baz   │\n' +
      '├─────┼────────┼────────┼────────┤\n' +
      '│  7  │        │        │  Foo   │\n' +
      '│     │        │   9    │  Bar   │\n' +
      '│     │   8    │        │  Baz   │\n' +
      '╰─────┴────────┴────────┴────────╯';

    // Act
    const result = tabelify(data, {
      tabelifyOptions: { rowDivider: true },
      columnOptions: {
        top: { verticalAlignment: 'top' },
        bottom: { verticalAlignment: 'bottom' },
      },
    });
    const cleanedResult = stripAnsi(result);

    // Assert
    expect(cleanedResult).toEqual(cleanedExpected);
  });
});
