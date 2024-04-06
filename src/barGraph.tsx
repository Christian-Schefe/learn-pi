import { Ref } from 'preact';
import { useMeasure } from 'react-use';

export const BarGraph = (props: {
  data: { label: string; value: number }[];
  height: number;
}) => {
  const [ref, { height }] = useMeasure();

  const labels = props.data.map(el => {
    return <Tick text={el.label} />;
  });

  const maxValue = Math.max(...props.data.map(el => el.value));
  console.log('max:', maxValue, props.data);

  const vertTicks = [...Array(5).keys()]
    .map(i => i / 4)
    .map(i => (
      <VertTick
        text={(i * maxValue * 100).toFixed(1) + '%'}
        percentage={1 - i}
        height={height}
      />
    ));

  const bars = props.data.map(el => {
    const cells = [...Array(5).keys()].map(_ => (
      <div
        class="outline outline-white outline-1 w-full"
        style={{ height: `${height / 5}px` }}
      ></div>
    ));

    return (
      <div class="relative w-full">
        <div
          class={`absolute bg-blue-500 left-[10%] right-[10%] top-auto bottom-0`}
          style={{ height: `${(el.value / maxValue) * 100}%` }}
        ></div>
        <div class="flex flex-col place-content-evenly w-full h-full">
          {cells}
        </div>
      </div>
    );
  });

  return (
    <div class="w-full h-full grid grid-cols-[40px_auto_40px] grid-rows-[auto_40px]">
      <div class="flex flex-col place-content-evenly row-span-2 mb-[40px] relative">
        {vertTicks}
      </div>
      <div
        class="flex place-content-evenly"
        ref={ref as Ref<HTMLDivElement>}
        style={{ height: `${props.height - 40}px` }}
      >
        {bars}
      </div>
      <div class="row-span-2" />
      <div class="flex place-content-evenly">{labels}</div>
    </div>
  );
};

const Tick = (props: { text: string }) => {
  return (
    <div class="w-full h-full relative">
      <div class="absolute rotate-45 left-0 right-0 top-0 bottom-0 flex justify-center items-center">
        <p class="whitespace-nowrap dark:text-white">{props.text}</p>
      </div>
    </div>
  );
};

const VertTick = (props: {
  text: string;
  percentage: number;
  height: number;
}) => {
  const px = (props.percentage - 0.5) * props.height;
  return (
    <div
      class="w-full h-fit absolute left-0 right-0"
      style={{ transform: `translate(0,${px}px)` }}
    >
      <div class="absolute left-0 right-0 top-0 bottom-0 flex justify-end items-center">
        <p class="whitespace-nowrap dark:text-white">{props.text}</p>
      </div>
    </div>
  );
};
