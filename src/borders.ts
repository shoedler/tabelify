const rounded = {
  topLeftCorner: '╭─',
  topRightCorner: '─╮',
  bottomLeftCorner: '╰─',
  bottomRightCorner: '─╯',
  vertical: '│',
  horizontal: '─',
  verticalDownIntersection: '─┬─',
  verticalUpIntersection: '─┴─',
  horizontalRightIntersection: '├─',
  horizontalLeftIntersection: '─┤',
  intersection: '─┼─',
};

const double = {
  topLeftCorner: '╔═',
  topRightCorner: '═╗',
  bottomLeftCorner: '╚═',
  bottomRightCorner: '═╝',
  vertical: '║',
  horizontal: '═',
  verticalDownIntersection: '═╦═',
  verticalUpIntersection: '═╩═',
  horizontalRightIntersection: '╠═',
  horizontalLeftIntersection: '═╣',
  intersection: '═╬═',
};

const single = {
  topLeftCorner: '┌─',
  topRightCorner: '─┐',
  bottomLeftCorner: '└─',
  bottomRightCorner: '─┘',
  vertical: '│',
  horizontal: '─',
  verticalDownIntersection: '─┬─',
  verticalUpIntersection: '─┴─',
  horizontalRightIntersection: '├─',
  horizontalLeftIntersection: '─┤',
  intersection: '─┼─',
};

const bold = {
  topLeftCorner: '┏━',
  topRightCorner: '━┓',
  bottomLeftCorner: '┗━',
  bottomRightCorner: '━┛',
  vertical: '┃',
  horizontal: '━',
  verticalDownIntersection: '━┳━',
  verticalUpIntersection: '━┻━',
  horizontalRightIntersection: '┣━',
  horizontalLeftIntersection: '━┫',
  intersection: '━╋━',
};

const ascii = {
  topLeftCorner: '+-',
  topRightCorner: '-+',
  bottomLeftCorner: '+-',
  bottomRightCorner: '-+',
  vertical: '|',
  horizontal: '-',
  verticalDownIntersection: '-+-',
  verticalUpIntersection: '-+-',
  horizontalRightIntersection: '+-',
  horizontalLeftIntersection: '-+',
  intersection: '-+-',
};

const borderConfigs = {
  rounded,
  double,
  single,
  bold,
  ascii,
};

export type BorderConfig = keyof typeof borderConfigs;

export const provideBorderConfig = (border: BorderConfig) => borderConfigs[border];
