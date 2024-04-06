import digitsTxt from '/digits.txt?raw';
import { DigitsGrid } from './digitsGrid';
import { DigitButtonRow } from './mobileInput';
import { KeyboardListener } from './keyboardListener';
import { saveScore } from './middleware';
import { BackArrow } from './backArrow';
import { MAX_MISTAKES } from './utils/consts';
import { useStoredState } from './utils/storedState';

export const PI = digitsTxt.slice(2).split('').map(Number);

export function Play() {
  const [digits, setDigits] = useStoredState('digits', 0);
  const [mistakes, setMistakes] = useStoredState('mistakes', 0);
  const [highscore, setHighscore] = useStoredState('highscore', 0);
  const [gameOver, setGameOver] = useStoredState('gameover', false);
  const [history, setHistory] = useStoredState<number[]>('history', []);

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
      await onSaveScore(digits);
    }
  };

  const onGameOver = async () => {
    const shouldSave = !gameOver && digits > 0;
    setGameOver(true);

    console.log('game over, saving score:', shouldSave);
    if (shouldSave) {
      await onSaveScore(digits);
    }
  };

  const onSaveScore = async (score: number) => {
    setHistory([...history, score]);
    await saveScore(score);
  };

  return (
    <>
      <KeyboardListener callback={onKeyboardInput} />
      <DigitsGrid
        digits={digits}
        mistakes={mistakes}
        highscore={highscore}
        resetCallback={resetProgress}
        uncover={gameOver}
        surrenderCallback={onGameOver}
      />
      <DigitButtonRow callback={onNumberInput} />
      <BackArrow />
    </>
  );
}
