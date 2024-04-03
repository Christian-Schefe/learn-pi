import './app.css';
import digitsTxt from '/digits.txt?raw';
import piSvg from '/pi.svg';
import { DigitsGrid } from './digitsGrid';
import { DigitButtonRow } from './mobileInput';
import { useState } from 'preact/hooks';
import { KeyboardListener } from './keyboardListener';

const pi = digitsTxt.slice(2).split('').map(Number);
const backendUrl = 'https://learn-pi-backend.shuttleapp.rs/scores';

interface Entry {
  id: number;
  score: number;
}

async function saveScore(score: number): Promise<number> {
  const response = await fetch(backendUrl, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({ score: score }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const json: Entry = await response.json();
  console.log('saved: ', json);
  return json.id;
}

export function App() {
  const [digits, setDigits] = useState(
    Number.parseInt(localStorage.getItem('digits') ?? '') || 0,
  );
  const [mistakes, setMistakes] = useState(
    Number.parseInt(localStorage.getItem('mistakes') ?? '') || 0,
  );
  const [highscore, setHighscore] = useState(
    Number.parseInt(localStorage.getItem('highscore') ?? '') || 0,
  );

  const callback = async (digit: number) => {
    const isCorrect = pi[digits] === digit;
    if (!isCorrect) {
      localStorage.setItem('mistakes', (mistakes + 1).toString());
      if (mistakes === 0) {
        console.log("made a mistake, saving score");
        await saveScore(digits);
      }
      setMistakes(prev => prev + 1);
    } else {
      localStorage.setItem('digits', (digits + 1).toString());
      setDigits(prev => prev + 1);
      setHighscore(Math.max(highscore, digits + 1));
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

  const resetProgress = async () => {
    if (mistakes === 0) {
      console.log("resetting without a mistake, saving score");
      await saveScore(digits);
    }
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
        digits of <img class="inline-block w-6 h-6 ml-1" src={piSvg}></img>
      </h1>
      <DigitsGrid
        digits={digitsToShow}
        mistakes={mistakes}
        highscore={highscore}
        resetCallback={resetProgress}
      ></DigitsGrid>
      <div class="w-full h-0 mb-4"></div>
      <DigitButtonRow callback={callback}></DigitButtonRow>
    </div>
  );
}
