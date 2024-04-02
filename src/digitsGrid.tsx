import { useMeasure } from 'react-use';
import { DigitCell } from './digitCell';
import { Ref } from 'preact';
import { MistakeCounter } from './mistakeCounter';

function calcRows(width: number) {
  return Math.max(3, Math.min(15, Math.floor(width / 32) - 1));
}

interface Props {
  digits: number[];
  mistakes: number;
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
    if (i == 0) cells.push(DigitCell('3'));
    else if (i == 1) cells.push(DigitCell('.'));
    else {
      const digitIndex = i - 2;
      const text =
        digitIndex < props.digits.length
          ? props.digits[digitIndex].toString()
          : '';
      cells.push(DigitCell(text));
    }
  }

  const style = {
    'grid-template-columns': `repeat(${cellsPerRow}, minmax(0, 1fr))`,
  };

  return (
    <div ref={ref as Ref<HTMLDivElement>} class="flex flex-col items-center">
      <div class="flex flex-col gap-3">
        <div class="grid w-fit gap-[1px] p-[1px] bg-blue-400" style={style}>
          {cells}
        </div>
        <MistakeCounter mistakes={props.mistakes}></MistakeCounter>
      </div>
    </div>
  );
}
