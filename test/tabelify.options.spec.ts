import { stripAnsi } from '../src/stripAnsi.js';
import { tabelify } from '../src/tabelify.js';

describe(tabelify.name + ' TabelifyOptions.border', () => {
  it('should add a round', () => {
    // Arrange
    const data = [1, 2, 3];
    const cleanedExpected =
      '╭─────────╮\n' +
      '│ [Value] │\n' +
      '├─────────┤\n' +
      '│    1    │\n' +
      '├─────────┤\n' +
      '│    2    │\n' +
      '├─────────┤\n' +
      '│    3    │\n' +
      '╰─────────╯';

    // Act
    const result = tabelify(data, { tabelifyOptions: { rowDivider: true } });
    const cleanedResult = stripAnsi(result);

    // Assert
    expect(cleanedResult).toEqual(cleanedExpected);
  });

  it('should add indices', () => {
    // Arrange
    const data = [1, 2, 3];
    const cleanedExpected =
      '╭─────────┬─────────╮\n' +
      '│ [Index] │ [Value] │\n' +
      '├─────────┼─────────┤\n' +
      '│    0    │    1    │\n' +
      '│    1    │    2    │\n' +
      '│    2    │    3    │\n' +
      '╰─────────┴─────────╯';

    // Act
    const result = tabelify(data, { tabelifyOptions: { indices: true } });
    const cleanedResult = stripAnsi(result);

    // Assert
    expect(cleanedResult).toEqual(cleanedExpected);
  });

  it('should recurse arrays', () => {
    // Arrange
    const data = [1, 2, [3, 4, 5]];
    const cleanedExpected =
      '╭─────────────╮\n' +
      '│   [Value]   │\n' +
      '├─────────────┤\n' +
      '│      1      │\n' +
      '│      2      │\n' +
      '│ ╭─────────╮ │\n' +
      '│ │ [Value] │ │\n' +
      '│ ├─────────┤ │\n' +
      '│ │    3    │ │\n' +
      '│ │    4    │ │\n' +
      '│ │    5    │ │\n' +
      '│ ╰─────────╯ │\n' +
      '╰─────────────╯';

    // Act
    const result = tabelify(data, { tabelifyOptions: { recurse: true } });
    const cleanedResult = stripAnsi(result);

    // Assert
    expect(cleanedResult).toEqual(cleanedExpected);
  });

  it('should recurse objects', () => {
    // Arrange
    const data = [1, 2, { a: 'foo', b: 'bar', c: 'baz' }];
    const cleanedExpected =
      '╭─────┬─────┬─────┬─────────╮\n' +
      '│  a  │  b  │  c  │ [Value] │\n' +
      '├─────┼─────┼─────┼─────────┤\n' +
      '│  ─  │  ─  │  ─  │    1    │\n' +
      '│  ─  │  ─  │  ─  │    2    │\n' +
      '│ foo │ bar │ baz │    ─    │\n' +
      '╰─────┴─────┴─────┴─────────╯';

    // Act
    const result = tabelify(data, { tabelifyOptions: { recurse: true } });
    const cleanedResult = stripAnsi(result);

    // Assert
    expect(cleanedResult).toEqual(cleanedExpected);
  });
});
