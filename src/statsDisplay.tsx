import resetSvg from '/reset.svg';

function getClassByMistakes(mistakes: number) {
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

export const StatsDisplay = (props: {
  mistakes: number;
  digits: number;
  resetCallback: () => void;
}) => {
  return (
    <div class="flex flex-row flex-wrap gap-2 items-center justify-start self-start col-span-full bg-[#242424]">
      <button
        onClick={props.resetCallback}
        class="rounded-sm text-xl bg-blue-500 hover:bg-blue-600 active:bg-blue-700 min-w-8 h-8 flex gap-2 items-center justify-center"
      >
        <img src={resetSvg} alt="Logo" class="w-6 h-6" />
      </button>
      <div class="px-2 rounded-sm text-xl bg-blue-500 min-w-8 h-8 flex gap-2 items-center justify-center">
        <p class="text-xl tracking-wide [text-shadow:_0px_0px_5px_var(--tw-shadow-color)] shadow-gray-700">
          Digits:
        </p>
        <h1 class="font-bold [text-shadow:_0px_0px_5px_var(--tw-shadow-color)] shadow-gray-700">
          {props.digits}
        </h1>
      </div>
      <div
        class={`rounded-sm gap-2 px-2 text-xl ${getClassByMistakes(props.mistakes)} min-w-8 h-8 flex items-center justify-center`}
      >
        <p class="text-xl tracking-wide [text-shadow:_0px_0px_5px_var(--tw-shadow-color)] shadow-gray-700">
          Mistakes:
        </p>
        <h1 class="font-bold [text-shadow:_0px_0px_5px_var(--tw-shadow-color)] shadow-gray-700">
          {props.mistakes}
        </h1>
      </div>
    </div>
  );
};
