import { MAX_MISTAKES } from './app';
import resetSvg from '/reset.svg';
import surrenderSvg from '/surrender.svg';

function getClassByMistakes(mistakes: number) {
  if (mistakes == 0) {
    return 'bg-green-500';
  } else if (mistakes <= 3) {
    return 'bg-yellow-500';
  } else if (mistakes <= MAX_MISTAKES) {
    return 'bg-orange-500';
  } else {
    return 'bg-red-500';
  }
}

export const StatsDisplay = (props: {
  mistakes: number;
  digits: number;
  highscore: number;
  resetCallback: () => void;
  surrenderCallback: () => void;
  uncovered: boolean;
}) => {
  return (
    <div class="text-white flex flex-row flex-wrap gap-2 items-center justify-start self-start col-span-full bg-white dark:bg-[#242424]">
      <button
        onClick={props.resetCallback}
        class="rounded-sm text-xl bg-blue-500 hover:bg-blue-600 active:bg-blue-700 min-w-8 h-8 flex gap-2 items-center justify-center"
      >
        <img src={resetSvg} alt="Logo" class="w-6 h-6" />
      </button>
      <button
        onClick={props.surrenderCallback}
        class="rounded-sm text-xl bg-blue-500 hover:bg-blue-600 active:bg-blue-700 min-w-8 h-8 flex gap-2 items-center justify-center"
      >
        <img src={surrenderSvg} alt="Logo" class="w-6 h-6" />
      </button>
      <div class="px-2 rounded-sm text-xl bg-blue-500 min-w-8 h-8 flex gap-2 items-center justify-center">
        <p class="text-xl tracking-wide">Digits:</p>
        <h1 class="font-bold">{props.digits}</h1>
      </div>
      <div class="rounded-sm gap-2 px-2 text-xl bg-blue-500 min-w-8 h-8 flex items-center justify-center">
        <p class="text-xl tracking-wide">Highscore:</p>
        <h1 class="font-bold">{props.highscore}</h1>
      </div>
      <div
        class={`rounded-sm gap-2 px-2 text-xl ${getClassByMistakes(props.mistakes)} min-w-8 h-8 flex items-center justify-center`}
      >
        <p class="text-xl tracking-wide">Mistakes:</p>
        <h1 class="font-bold">
          {props.mistakes}/{MAX_MISTAKES}
        </h1>
      </div>
    </div>
  );
};
