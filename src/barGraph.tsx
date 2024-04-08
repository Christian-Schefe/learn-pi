import { Ref } from 'preact';
import { useMeasure } from 'react-use';

export const BarGraph = (props: {
  data?: { label: string; value: number }[];
  height: number;
}) => {
  const [ref, { height }] = useMeasure();

  if (!props.data) return <div>No Data</div>;

  const labels = props.data.map(el => {
    return <Tick text={el.label} />;
  });

  const maxValue = Math.max(...props.data.map(el => el.value));

  const stepDivider = maxValue <= 0.3 ? 20 : 10;

  const nextMultiple = Math.ceil(maxValue * stepDivider) / stepDivider;
  const tickCount = Math.ceil(maxValue * stepDivider);

  const vertTicks = [...Array(tickCount + 1).keys()]
    .map(i => i / tickCount)
    .map(i => (
      <VertTick
        text={(i * nextMultiple * 100).toFixed(0) + '%'}
        percentage={1 - i}
        height={height}
      />
    ));

  const bars = props.data.map((el, x) => {
    const cells = [...Array(tickCount).keys()].map(y => (
      <div
        class={`${x > 0 ? 'border-l-[1px] -ml-[1px]' : ''} ${y > 0 ? 'border-t-[1px] -mt-[1px]' : ''} border-black dark:border-white`}
        style={{ height: `${height / tickCount}px` }}
      ></div>
    ));

    return (
      <div class="relative w-full">
        <div
          class={`absolute bg-blue-500 left-[20%] right-[20%] top-auto bottom-0`}
          style={{ height: `${(el.value / nextMultiple) * 100}%` }}
        ></div>
        <div class="flex flex-col place-content-evenly w-full h-full gap-[1px]">
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
        class="flex place-content-evenly outline outline-black dark:outline-white outline-1 gap-[1px]"
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
    <div class="w-full h-full relative flex justify-center">
      <div class="w-full h-full absolute flex">
        <p class="w-full h-fit origin-left text-left rotate-45 translate-x-[calc(50%-2px)] text-sm whitespace-nowrap dark:text-white">
          {props.text}
        </p>
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
        <p class="whitespace-nowrap dark:text-white pr-1 text-sm">
          {props.text}
        </p>
      </div>
    </div>
  );
};
