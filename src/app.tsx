import { useState } from 'preact/hooks';
import './app.css';
import { KeyboardListener, ResizeListener } from './keyboard-listener';
import digitsTxt from '/digits.txt?raw';

export function App() {
  return (
    <div class="flex flex-col gap-5">
      <h1 class="text-2xl">
        Learn{' '}
        <span class="[text-shadow:_0px_0px_5px_var(--tw-shadow-color)] shadow-gray-700 rounded-sm font-bold text-xl bg-blue-500 min-w-8 h-8 p-2 inline-flex items-center justify-center">
          1,000,000
        </span>{' '}
        digits of π
      </h1>
      <DigitsWrapper></DigitsWrapper>
      <div class="text-xl">
        <h1 class="font-bold text-2xl m-3 mt-20"> Controls</h1>
        <p>
          <span class="[text-shadow:_0px_0px_5px_var(--tw-shadow-color)] shadow-gray-700 rounded-sm font-bold text-xl bg-blue-500 min-w-8 h-8 p-2 inline-flex items-center justify-center">
            R
          </span>{' '}
          reset
        </p>
      </div>
    </div>
  );
}

const pi = digitsTxt.slice(2).split('').map(Number);

function calcRows(width: number) {
  return Math.min(15, Math.floor(width / 32) - 4);
}

function DigitsWrapper() {
  const [digits, setDigits] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [cellsPerRow, setCellsPerRow] = useState(calcRows(window.outerWidth));

  function handleKey(e: KeyboardEvent) {
    if (e.key == 'r') return resetProgress();

    const num = parseInt(e.key);
    if (!Number.isInteger(num) || num < 0 || num >= 10) return;
    const isCorrect = pi[digits.length] === num;
    if (!isCorrect) {
      setMistakes(n => n + 1);
      return;
    }
    setDigits(prev => [...prev, num]);
  }

  function resetProgress() {
    setMistakes(0);
    setDigits(_ => []);
  }

  function resize(event: Event) {
    const width = (event.target as Window).outerWidth;
    setCellsPerRow(_ => calcRows(width));
    console.log(cellsPerRow);
  }

  const cells = [];
  const minRows = 15;
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

  function getClassByMistakes() {
    if (mistakes == 0) {
      return 'bg-green-500';
    } else if (mistakes <= 3) {
      return 'bg-yellow-500';
    } else if (mistakes <= 5) {
      return 'bg-orange-500';
    } else {
      return 'bg-red-500';
    }
  }

  const style = {
    'grid-template-columns': `repeat(${cellsPerRow}, minmax(0, 1fr))`,
  };

  return (
    <div class="flex flex-col items-center">
      <KeyboardListener callback={handleKey}></KeyboardListener>
      <ResizeListener callback={resize}></ResizeListener>
      <div class="flex flex-col gap-3">
        <div
          class="grid grid-cols-3 w-fit gap-[1px] p-[1px] bg-blue-400"
          style={style}
        >
          {cells}
        </div>
        <div class="flex gap-2 items-center justify-start col-span-full bg-[#242424]">
          <p class="text-xl tracking-wide">Mistakes:</p>
          <div
            class={`rounded-sm font-bold text-xl ${getClassByMistakes()} min-w-8 h-8 flex items-center justify-center`}
          >
            <h1 class="[text-shadow:_0px_0px_5px_var(--tw-shadow-color)] shadow-gray-700">
              {mistakes}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

function DigitCell(text: string) {
  return (
    <div class="min-w-8 min-h-8 font-bold flex text-xl items-center justify-center bg-[#242424]">
      {text}
    </div>
  );
}
