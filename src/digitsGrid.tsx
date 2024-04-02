import { useState } from 'preact/hooks';
import { useMeasure } from 'react-use';
import { DigitCell } from './digitCell';
import { Ref } from 'preact';
import { KeyboardListener } from './keyboard-listener';
import { MistakeCounter } from './mistakeCounter';

function calcRows(width: number) {
  return Math.max(3, Math.min(15, Math.floor(width / 32) - 1));
}

interface Props {
  pi: number[];
}

export function DigitsGrid(props: Props) {
  const [digits, setDigits] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [ref, { width }] = useMeasure();

  function handleKey(e: KeyboardEvent) {
    if (e.key == 'r') return resetProgress();
    const num = parseInt(e.key);
    if (!Number.isInteger(num) || num < 0 || num >= 10) return;

    const isCorrect = props.pi[digits.length] === num;
    if (!isCorrect) {
      setMistakes(prev => prev + 1);
    } else {
      setDigits(prev => [...prev, num]);
    }
  }

  function resetProgress() {
    setMistakes(0);
    setDigits(_ => []);
  }

  const cells = [];
  const minRows = 15;
  const cellsPerRow = calcRows(width);
  const rowsCount = Math.max(
    Math.floor((digits.length + 1) / cellsPerRow) + 2,
    minRows,
  );

  for (let i = 0; i < rowsCount * cellsPerRow; i++) {
    if (i == 0) cells.push(DigitCell('3'));
    else if (i == 1) cells.push(DigitCell('.'));
    else {
      const digitIndex = i - 2;
      const text =
        digitIndex < digits.length ? digits[digitIndex].toString() : '';
      cells.push(DigitCell(text));
    }
  }

  const style = {
    'grid-template-columns': `repeat(${cellsPerRow}, minmax(0, 1fr))`,
  };

  return (
    <div ref={ref as Ref<HTMLDivElement>} class="flex flex-col items-center">
      <KeyboardListener callback={handleKey}></KeyboardListener>
      <div class="flex flex-col gap-3">
        <div class="grid w-fit gap-[1px] p-[1px] bg-blue-400" style={style}>
          {cells}
        </div>
        <MistakeCounter mistakes={mistakes}></MistakeCounter>
      </div>
    </div>
  );
}
