import { useMeasure } from 'react-use';
import { DigitCell } from './digitCell';
import { Ref } from 'preact';
import { StatsDisplay } from './statsDisplay';

function calcRows(width: number) {
  const withoutPadding = width - 4;
  const cellSizeWithGap = 32 + 4;
  return Math.max(
    3,
    Math.min(15, Math.floor(withoutPadding / cellSizeWithGap)),
  );
}

interface Props {
  digits: number[];
  mistakes: number;
  resetCallback: () => void;
}

export function DigitsGrid(props: Props) {
  const [ref, { width }] = useMeasure();

  const cells = [];
  const minRows = 15;
  const cellsPerRow = calcRows(width);
  const rowsCount = Math.max(
    Math.floor((props.digits.length + 1) / cellsPerRow) + 2,
    minRows,
  );

  for (let i = 0; i < rowsCount * cellsPerRow; i++) {
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
    'grid-template-columns': `repeat(${cellsPerRow}, minmax(0, 1fr))`,
  };

  return (
    <div ref={ref as Ref<HTMLDivElement>} class="flex flex-col items-center">
      <div class="flex flex-col gap-3 items-center">
        <div class="grid w-fit gap-1 py-1" style={style}>
          {cells}
        </div>
        <StatsDisplay mistakes={props.mistakes} digits={props.digits.length} resetCallback={props.resetCallback}></StatsDisplay>
      </div>
    </div>
  );
}
