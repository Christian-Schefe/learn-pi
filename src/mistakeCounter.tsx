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

export const MistakeCounter = (props: { mistakes: number }) => {
  return (
    <div class="flex gap-2 items-center justify-start col-span-full bg-[#242424]">
      <p class="text-xl tracking-wide">Mistakes:</p>
      <div
        class={`rounded-sm font-bold text-xl ${getClassByMistakes(props.mistakes)} min-w-8 h-8 flex items-center justify-center`}
      >
        <h1 class="[text-shadow:_0px_0px_5px_var(--tw-shadow-color)] shadow-gray-700">
          {props.mistakes}
        </h1>
      </div>
    </div>
  );
};
