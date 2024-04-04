import { DigitCell } from './digitCell';
import { StatsDisplay } from './statsDisplay';
import { PI } from './app';
import { useWindowWidth } from '@react-hook/window-size/throttled';

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
  console.log('cols:', cols);
  console.log('window width:', width);
  return { cols, gridWidth: cols * paddedCellSize - gap };
}

interface Props {
  digits: number;
  mistakes: number;
  highscore: number;
  uncover: boolean;
  resetCallback: () => void;
  surrenderCallback: () => void;
}

export function DigitsGrid(props: Props) {
  const cells = [];
  const windowSize = useWindowWidth();

  const { cols, gridWidth } = calcCols(windowSize);

  const minRows = cols;
  const rowsCount = Math.max(
    Math.floor((props.digits + 1) / cols) + 2,
    minRows,
  );

  cells.push(DigitCell({ text: '3', discovered: true }));
  cells.push(DigitCell({ text: '.', discovered: true }));

  for (let i = 0; i < rowsCount * cols - 2; i++) {
    const isDiscovered = i < props.digits;
    const text = isDiscovered || props.uncover ? PI[i].toString() : '';
    cells.push(DigitCell({ text, index: i, discovered: isDiscovered }));
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
          surrenderCallback={props.surrenderCallback}
        ></StatsDisplay>
      </div>
    </div>
  );
}
