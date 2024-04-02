export function DigitCell(text: string, index: number) {
  const isMilestone = index >= 49 && (index + 1) % 50 === 0;
  const color =
    text.length > 0
      ? isMilestone
        ? 'bg-blue-500'
        : 'bg-slate-500'
      : 'bg-gray-600';
  const textColor = isMilestone ? 'text-white' : 'text-white';
  return (
    <div
      class={`min-w-8 min-h-8 rounded-sm ${color} font-bold flex text-xl items-center justify-center`}
    >
      <p class={textColor}>{text}</p>
    </div>
  );
}
