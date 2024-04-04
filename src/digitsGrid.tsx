import { DigitCell } from './digitCell';
import { StatsDisplay } from './statsDisplay';
import { PI } from './app';

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
  digits: number;
  mistakes: number;
  highscore: number;
  uncover: boolean;
  resetCallback: () => void;
  uncoverCallback: () => void;
}

export function DigitsGrid(props: Props) {
  const cells = [];
  const { cols, gridWidth } = calcCols(props.windowSize.width);

  const minRows = cols;
  const rowsCount = Math.max(
    Math.floor((props.digits + 1) / cols) + 2,
    minRows,
  );

  for (let i = 0; i < rowsCount * cols; i++) {
    if (i == 0)
      cells.push(DigitCell({ text: '3', index: 0, discovered: true }));
    else if (i == 1)
      cells.push(DigitCell({ text: '.', index: 0, discovered: true }));
    else {
      const digitIndex = i - 2;
      const isDiscovered = digitIndex < props.digits;
      const text =
        isDiscovered || props.uncover ? PI[digitIndex].toString() : '';
      cells.push(
        DigitCell({ text, index: digitIndex, discovered: isDiscovered }),
      );
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
          digits={props.digits}
          resetCallback={props.resetCallback}
          uncovered={props.uncover}
          uncoverCallback={props.uncoverCallback}
        ></StatsDisplay>
      </div>
    </div>
  );
}
