import { stripAnsi } from '../src/stripAnsi.js';
import { tabelify } from '../src/tabelify.js';

describe(tabelify.name, () => {
  it('should work with primitives and without config', () => {
    // Arrange
    const data = [1, 2, 3];
    const cleanedExpected =
      '╭─────────╮\n' +
      '│ [Value] │\n' +
      '├─────────┤\n' +
      '│    1    │\n' +
      '│    2    │\n' +
      '│    3    │\n' +
      '╰─────────╯';

    // Act
    const result = tabelify(data);
    const cleanedResult = stripAnsi(result);

    // Assert
    expect(cleanedResult).toEqual(cleanedExpected);
  });

  it('should work with primitives and with indices', () => {
    // Arrange
    const data = [1, 'lol', null, undefined, 123n, true];
    const cleanedExpected =
      '╭─────────┬─────────╮\n' +
      '│ [Index] │ [Value] │\n' +
      '├─────────┼─────────┤\n' +
      '│    0    │    1    │\n' +
      '│    1    │   lol   │\n' +
      '│    2    │  null   │\n' +
      '│    3    │  undef  │\n' +
      '│    4    │  123n   │\n' +
      '│    5    │  true   │\n' +
      '╰─────────┴─────────╯';

    // Act
    const result = tabelify(data, { tabelifyOptions: { indices: true } });
    const cleanedResult = stripAnsi(result);

    // Assert
    expect(cleanedResult).toEqual(cleanedExpected);
  });
});
