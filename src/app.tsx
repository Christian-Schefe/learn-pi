import './app.css';
import digitsTxt from '/digits.txt?raw';
import { DigitsGrid } from './digitsGrid';
import { DigitButtonRow } from './mobileInput';
import { useState } from 'preact/hooks';
import { KeyboardListener } from './keyboardListener';

const pi = digitsTxt.slice(2).split('').map(Number);

export function App() {
  const [digits, setDigits] = useState(
    Number.parseInt(localStorage.getItem('digits') ?? '') || 0,
  );
  const [mistakes, setMistakes] = useState(
    Number.parseInt(localStorage.getItem('mistakes') ?? '') || 0,
  );

  const callback = (digit: number) => {
    const isCorrect = pi[digits] === digit;
    if (!isCorrect) {
      localStorage.setItem('mistakes', (mistakes + 1).toString());
      setMistakes(prev => prev + 1);
    } else {
      localStorage.setItem('digits', (digits + 1).toString());
      setDigits(prev => prev + 1);
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
    setDigits(0);
    setMistakes(0);
    localStorage.setItem('mistakes', '0');
    localStorage.setItem('digits', '0');
  };

  const digitsToShow = pi.slice(0, digits);

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
      <DigitsGrid digits={digitsToShow} mistakes={mistakes}></DigitsGrid>
      <div class="text-xl mb-10">
        <h1 class="font-bold text-2xl m-3"> Controls</h1>
        <p>
          <button
            class="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-2 px-4 rounded self-center"
            onClick={resetProgress}
          >
            reset
          </button>
          <p class="inline-block ml-2">Keyboard Shortcut: R</p>
        </p>
      </div>

      <DigitButtonRow callback={callback}></DigitButtonRow>
    </div>
  );
}
