import { DigitCell } from './digitCell';
import { StatsDisplay } from './statsDisplay';

const windowPadding = 32 * 2;
const cellSize = 32;
const gap = 4;

function calcCols(width: number): { cols: number; gridWidth: number } {
  const minCols = 3;
  const paddedCellSize = cellSize + gap;
  const availableWidth = width - windowPadding;
  const spaceForCols = availableWidth + gap - paddedCellSize * minCols;

  const fittingRows = Math.floor(spaceForCols / paddedCellSize);

  const cols = Math.min(15, minCols + fittingRows);
  return { cols, gridWidth: cols * paddedCellSize - gap };
}

interface Props {
  windowSize: { width: number; height: number };
  digits: number[];
  mistakes: number;
  highscore: number;
  resetCallback: () => void;
}

export function DigitsGrid(props: Props) {
  const cells = [];
  const { cols, gridWidth } = calcCols(props.windowSize.width);

  const minRows = cols;
  const rowsCount = Math.max(
    Math.floor((props.digits.length + 1) / cols) + 2,
    minRows,
  );

  for (let i = 0; i < rowsCount * cols; i++) {
    if (i == 0) cells.push(DigitCell('3', 0));
    else if (i == 1) cells.push(DigitCell('.', 0));
    else {
      const digitIndex = i - 2;
      const text =
        digitIndex < props.digits.length
          ? props.digits[digitIndex].toString()
          : '';
      cells.push(DigitCell(text, digitIndex));
    }
  }

  const style = {
    'grid-template-columns': `repeat(${cols}, ${cellSize}px)`,
    width: gridWidth + 'px',
    gap: gap + 'px',
  };

  return (
    <div class="w-full h-full flex flex-col items-center">
      <div
        class="flex flex-col gap-3 items-center"
        style={{ width: style.width }}
      >
        <div class="grid py-1" style={style}>
          {cells}
        </div>
        <StatsDisplay
          highscore={props.highscore}
          mistakes={props.mistakes}
          digits={props.digits.length}
          resetCallback={props.resetCallback}
        ></StatsDisplay>
      </div>
    </div>
  );
}
