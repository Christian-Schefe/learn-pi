import './app.css';
import digitsTxt from '/digits.txt?raw';
import { DigitsGrid } from './digitsGrid';
import { DigitButtonRow } from './mobileInput';
import { useState } from 'preact/hooks';
import { KeyboardListener } from './keyboard-listener';

const pi = digitsTxt.slice(2).split('').map(Number);

export function App() {
  const [digits, setDigits] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);

  const callback = (digit: number) => {
    const isCorrect = pi[digits.length] === digit;
    if (!isCorrect) {
      setMistakes(prev => prev + 1);
    } else {
      setDigits(prev => [...prev, digit]);
    }
  };

  const handleKey = (event: KeyboardEvent) => {
    if (event.key === 'r') {
      resetProgress();
      return;
    }

    const num = parseInt(event.key);
    if (!Number.isInteger(num) || num < 0 || num >= 10) return;

    callback(parseInt(event.key));
  };

  const resetProgress = () => {
    setDigits([]);
    setMistakes(0);
  };

  return (
    <div class="flex flex-col gap-5">
      <KeyboardListener callback={handleKey}></KeyboardListener>
      <h1 class="text-2xl">
        Learn{' '}
        <span class="[text-shadow:_0px_0px_5px_var(--tw-shadow-color)] shadow-gray-700 rounded-sm font-bold text-xl bg-blue-500 min-w-8 h-8 p-2 inline-flex items-center justify-center">
          1,000,000
        </span>{' '}
        digits of π
      </h1>
      <DigitsGrid digits={digits} mistakes={mistakes}></DigitsGrid>
      <div class="text-xl mb-10">
        <h1 class="font-bold text-2xl m-3"> Controls</h1>
        <p>
        <button
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded self-center"
        onClick={resetProgress}
      >reset</button>
          <p class="inline-block ml-2">Keyboard Shortcut: R</p>
        </p>
      </div>
      
      <DigitButtonRow callback={callback}></DigitButtonRow>
    </div>
  );
}
