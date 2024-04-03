import digitsTxt from '/digits.txt?raw';
import piSvg from '/pi.svg';
import { DigitsGrid } from './digitsGrid';
import { DigitButtonRow } from './mobileInput';
import { useState } from 'preact/hooks';
import { KeyboardListener } from './keyboardListener';
import { useWindowSize } from 'react-use';

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

function useStoredState<T>(
  key: string,
  defaultValue: T,
): [T, (value: T) => void] {
  const [value, setValue] = useState(
    JSON.parse(localStorage.getItem(key) ?? 'null') ?? defaultValue,
  );

  const setAndStoreValue = (newValue: T) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setAndStoreValue];
}

export function App() {
  const [digits, setDigits] = useStoredState('digits', 0);
  const [mistakes, setMistakes] = useStoredState('mistakes', 0);
  const [highscore, setHighscore] = useStoredState('highscore', 0);

  const onNumberInput = async (digit: number) => {
    const isCorrect = pi[digits] === digit;
    if (!isCorrect) {
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);

      if (newMistakes === 1) {
        console.log('made a mistake, saving score');
        await saveScore(digits);
      }
    } else {
      const newDigits = digits + 1;
      setDigits(newDigits);

      if (mistakes === 0 && newDigits > highscore) {
        setHighscore(newDigits);
      }
    }
  };

  const onKeyboardInput = (event: KeyboardEvent) => {
    if (event.key === 'r') {
      resetProgress();
      return;
    }

    const num = parseInt(event.key);
    if (!Number.isInteger(num) || num < 0 || num >= 10) return;

    onNumberInput(parseInt(event.key));
  };

  const resetProgress = async () => {
    const shouldSave = mistakes === 0 && digits > 0;
    setDigits(0);
    setMistakes(0);
    if (shouldSave) {
      console.log('resetting without a mistake, saving score');
      await saveScore(digits);
    }
  };

  const digitsToShow = pi.slice(0, digits);
  const windowSize = useWindowSize();

  return (
    <div class="p-8 pb-[4.25rem] mx-0 my-auto text-center flex flex-col gap-5">
      <KeyboardListener callback={onKeyboardInput}></KeyboardListener>
      <h1 class="text-2xl">
        Learn{' '}
        <span class="[text-shadow:_0px_0px_5px_var(--tw-shadow-color)] shadow-gray-700 rounded-sm font-bold text-xl bg-blue-500 min-w-8 h-8 p-2 inline-flex items-center justify-center">
          1,000,000
        </span>{' '}
        digits of <img class="inline-block w-6 h-6 ml-1" src={piSvg}></img>
      </h1>
      <DigitsGrid
        windowSize={windowSize}
        digits={digitsToShow}
        mistakes={mistakes}
        highscore={highscore}
        resetCallback={resetProgress}
      ></DigitsGrid>
      <DigitButtonRow callback={onNumberInput}></DigitButtonRow>
    </div>
  );
}
