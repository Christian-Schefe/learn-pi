interface DigitCellProps {
  text: string;
  index?: number;
  discovered: boolean;
}

export function DigitCell(props: DigitCellProps) {
  const isMilestone = props.index != undefined && (props.index + 1) % 50 === 0;
  const color =
  props.discovered
      ? isMilestone
        ? 'bg-blue-500'
        : 'bg-slate-500'
      : 'bg-gray-600';
  const textColor = props.discovered ? 'text-white' : 'text-gray-300';
  return (
    <div
      class={`min-w-8 min-h-8 rounded-sm ${color} font-bold flex text-xl items-center justify-center`}
    >
      <p class={textColor}>{props.text}</p>
    </div>
  );
}
