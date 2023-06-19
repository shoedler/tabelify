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

export const borderConfigs = {
  rounded,
  double,
  single,
  bold,
  ascii,
};
