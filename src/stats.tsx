import { BackArrow } from './backArrow';
import { useStoredState } from './utils/storedState';

export function Stats() {
  const [highscore, setHighscore] = useStoredState('highscore', 0);
  const [history, setHistory] = useStoredState<number[]>('history', []);

  const average =
    history.length > 0
      ? history.reduce((a, b) => a + b, 0) / history.length
      : null;

  const resetStats = () => {
    setHighscore(0);
    setHistory([]);
  };

  return (
    <>
      <BackArrow to="" />
      <div class="flex flex-col gap-5 items-center self-center w-fit">
        <h2 class="font-bold mt-8 text-xl dark:text-white">Stats</h2>
        <div class="w-fit grid grid-cols-2 gap-2">
          <p class="text-lg dark:text-white text-left w-full self-center">
            Highscore:
          </p>
          <span class="ml-2 text-xl text-white rounded-sm font-bold bg-blue-500 min-w-8 px-2 h-10 inline-flex items-center justify-center">
            {highscore}
          </span>
          <p class="text-lg dark:text-white text-left w-full self-center">
            Average:
          </p>
          <span class="ml-2 text-xl text-white rounded-sm font-bold bg-blue-500 min-w-8 px-2 h-10 inline-flex items-center justify-center">
            {average ?? 'N/A'}
          </span>
        </div>
        <button
          onClick={resetStats}
          class="mt-4 text-white w-32 font-bold hover:bg-red-600 active:bg-red-700 rounded-sm gap-2 p-6 text-xl bg-red-500 min-w-8 h-8 flex items-center justify-center"
        >
          Reset
        </button>
      </div>
    </>
  );
}
