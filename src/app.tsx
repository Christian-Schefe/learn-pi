import './app.css';
import digitsTxt from '/digits.txt?raw';
import piSvg from '/pi.svg';
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

    fetch('https://learn-pi-backend.shuttleapp.rs/scores', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({ score: 0 }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        console.log(response);
        response.json();
      })
      .then(data => console.log(data));
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
        digits of <img class="inline-block w-6 h-6 ml-1" src={piSvg}></img>
      </h1>
      <DigitsGrid
        digits={digitsToShow}
        mistakes={mistakes}
        resetCallback={resetProgress}
      ></DigitsGrid>
      <div class="w-full h-0 mb-4"></div>
      <DigitButtonRow callback={callback}></DigitButtonRow>
    </div>
  );
}
