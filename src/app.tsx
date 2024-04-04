import digitsTxt from '/digits.txt?raw';
import piSvg from '/pi.svg';
import { DigitsGrid } from './digitsGrid';
import { DigitButtonRow } from './mobileInput';
import { useState } from 'preact/hooks';
import { KeyboardListener } from './keyboardListener';
import { saveScore } from './middleware';
import { ThemeToggle } from './theme';

export const PI = digitsTxt.slice(2).split('').map(Number);
export const MAX_MISTAKES = 5;

export function useStoredState<T>(
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
  const [gameOver, setGameOver] = useStoredState('gameover', false);

  const onNumberInput = async (digit: number) => {
    if (gameOver) return;

    const isCorrect = PI[digits] === digit;
    if (!isCorrect) {
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);

      if (newMistakes > MAX_MISTAKES) {
        await onGameOver();
      }
    } else {
      const newDigits = digits + 1;
      setDigits(newDigits);

      if (newDigits > highscore) {
        setHighscore(newDigits);
      }
    }
  };

  const onKeyboardInput = (event: KeyboardEvent) => {
    if (event.key.toLowerCase() === 'r') {
      resetProgress();
      return;
    }

    const num = parseInt(event.key);
    if (!Number.isInteger(num) || num < 0 || num >= 10) return;

    onNumberInput(parseInt(event.key));
  };

  const resetProgress = async () => {
    const shouldSave = !gameOver && digits > 0;
    setDigits(0);
    setMistakes(0);
    setGameOver(false);

    console.log('resetting, saving score:', shouldSave);
    if (shouldSave) {
      await saveScore(digits);
    }
  };

  const onGameOver = async () => {
    const shouldSave = !gameOver && digits > 0;
    setGameOver(true);

    console.log('game over, saving score:', shouldSave);
    if (shouldSave) {
      await saveScore(digits);
    }
  };

  return (
    <div class="p-8 pb-[4.25rem] mx-0 my-auto text-center flex flex-col gap-5">
      <KeyboardListener callback={onKeyboardInput}></KeyboardListener>
      <h1 class="text-2xl dark:text-white">
        Learn{' '}
        <span class="text-white rounded-sm font-bold text-xl bg-blue-500 min-w-8 h-8 p-2 inline-flex items-center justify-center">
          1,000,000
        </span>{' '}
        digits of <img class="inline-block w-6 h-6 ml-1" src={piSvg}></img>
        <ThemeToggle></ThemeToggle>
      </h1>
      <DigitsGrid
        digits={digits}
        mistakes={mistakes}
        highscore={highscore}
        resetCallback={resetProgress}
        uncover={gameOver}
        surrenderCallback={onGameOver}
      ></DigitsGrid>
      <DigitButtonRow callback={onNumberInput}></DigitButtonRow>
    </div>
  );
}
