import { stripAnsi } from '../src/stripAnsi.js';
import { tabelify } from '../src/tabelify.js';

describe(tabelify.name + ' TabelifyOptions.borderConfig', () => {
  it('should add a rounded border', () => {
    // Arrange
    const data = [1, [2, 3]];
    const cleanedExpected =
      '╭─────────┬───────────────────────╮\n' +
      '│ [Index] │        [Value]        │\n' +
      '├─────────┼───────────────────────┤\n' +
      '│    0    │           1           │\n' +
      '├─────────┼───────────────────────┤\n' +
      '│         │ ╭─────────┬─────────╮ │\n' +
      '│         │ │ [Index] │ [Value] │ │\n' +
      '│         │ ├─────────┼─────────┤ │\n' +
      '│    1    │ │    0    │    2    │ │\n' +
      '│         │ ├─────────┼─────────┤ │\n' +
      '│         │ │    1    │    3    │ │\n' +
      '│         │ ╰─────────┴─────────╯ │\n' +
      '╰─────────┴───────────────────────╯';

    // Act
    const result = tabelify(data, {
      tabelifyOptions: { indices: true, recurse: true, rowDivider: true, border: 'rounded' },
    });
    const cleanedResult = stripAnsi(result);

    // Assert
    expect(cleanedResult).toEqual(cleanedExpected);
  });

  it('should add a bold border', () => {
    // Arrange
    const data = [1, [2, 3]];
    const cleanedExpected =
      '┏━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━┓\n' +
      '┃ [Index] ┃        [Value]        ┃\n' +
      '┣━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━┫\n' +
      '┃    0    ┃           1           ┃\n' +
      '┣━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━┫\n' +
      '┃         ┃ ┏━━━━━━━━━┳━━━━━━━━━┓ ┃\n' +
      '┃         ┃ ┃ [Index] ┃ [Value] ┃ ┃\n' +
      '┃         ┃ ┣━━━━━━━━━╋━━━━━━━━━┫ ┃\n' +
      '┃    1    ┃ ┃    0    ┃    2    ┃ ┃\n' +
      '┃         ┃ ┣━━━━━━━━━╋━━━━━━━━━┫ ┃\n' +
      '┃         ┃ ┃    1    ┃    3    ┃ ┃\n' +
      '┃         ┃ ┗━━━━━━━━━┻━━━━━━━━━┛ ┃\n' +
      '┗━━━━━━━━━┻━━━━━━━━━━━━━━━━━━━━━━━┛';

    // Act
    const result = tabelify(data, {
      tabelifyOptions: { indices: true, recurse: true, rowDivider: true, border: 'bold' },
    });
    const cleanedResult = stripAnsi(result);

    // Assert
    expect(cleanedResult).toEqual(cleanedExpected);
  });

  it('should add a double border', () => {
    // Arrange
    const data = [1, [2, 3]];
    const cleanedExpected =
      '╔═════════╦═══════════════════════╗\n' +
      '║ [Index] ║        [Value]        ║\n' +
      '╠═════════╬═══════════════════════╣\n' +
      '║    0    ║           1           ║\n' +
      '╠═════════╬═══════════════════════╣\n' +
      '║         ║ ╔═════════╦═════════╗ ║\n' +
      '║         ║ ║ [Index] ║ [Value] ║ ║\n' +
      '║         ║ ╠═════════╬═════════╣ ║\n' +
      '║    1    ║ ║    0    ║    2    ║ ║\n' +
      '║         ║ ╠═════════╬═════════╣ ║\n' +
      '║         ║ ║    1    ║    3    ║ ║\n' +
      '║         ║ ╚═════════╩═════════╝ ║\n' +
      '╚═════════╩═══════════════════════╝';

    // Act
    const result = tabelify(data, {
      tabelifyOptions: { indices: true, recurse: true, rowDivider: true, border: 'double' },
    });
    const cleanedResult = stripAnsi(result);

    // Assert
    expect(cleanedResult).toEqual(cleanedExpected);
  });

  it('should add an ascii border', () => {
    // Arrange
    const data = [1, [2, 3]];
    const cleanedExpected =
      '+---------+-----------------------+\n' +
      '| [Index] |        [Value]        |\n' +
      '+---------+-----------------------+\n' +
      '|    0    |           1           |\n' +
      '+---------+-----------------------+\n' +
      '|         | +---------+---------+ |\n' +
      '|         | | [Index] | [Value] | |\n' +
      '|         | +---------+---------+ |\n' +
      '|    1    | |    0    |    2    | |\n' +
      '|         | +---------+---------+ |\n' +
      '|         | |    1    |    3    | |\n' +
      '|         | +---------+---------+ |\n' +
      '+---------+-----------------------+';

    // Act
    const result = tabelify(data, {
      tabelifyOptions: { indices: true, recurse: true, rowDivider: true, border: 'ascii' },
    });
    const cleanedResult = stripAnsi(result);

    // Assert
    expect(cleanedResult).toEqual(cleanedExpected);
  });
});
