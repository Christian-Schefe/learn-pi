import { Title } from './title';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LocationSaver } from './customRouter';
import { ScoreRange, getRanges } from './middleware';
import { useMeasure } from 'react-use';
import { Ref } from 'preact';
import { BarGraph } from './barGraph';
import { useTimedFetchStoredState } from './utils/storedState';

function MainPage() {
  const ranges = useTimedFetchStoredState('globalRanges', getRanges, 60000);

  let data = undefined;

  if (ranges) {
    const supplementedData = [...Array(ranges.range_count + 1).keys()].map(
      (_, index): ScoreRange => {
        const el = ranges.ranges.find(el => el.range_index === index);
        return el ?? { count_in_range: 0, range_index: index };
      },
    );

    data = supplementedData.map(el => {
      const i = ranges.range_size * el.range_index;
      return {
        label:
          el.range_index === ranges.range_count
            ? `${i}+`
            : `${i + 1}-${i + ranges.range_size}`,
        value: el.count_in_range / ranges.total_count,
      };
    });
  }

  const [ref, { height }] = useMeasure();

  return (
    <div class="flex flex-col gap-5 items-center self-center w-full h-full">
      <div class="w-fit flex gap-4 mt-24">
        <Link
          to="/play"
          class="text-white w-32 font-bold hover:bg-blue-600 active:bg-blue-700 rounded-sm gap-2 p-6 text-xl bg-blue-500 min-w-8 h-8 flex items-center justify-center"
        >
          Play
        </Link>
        <Link
          to="/stats"
          class="text-white w-32 font-bold hover:bg-blue-600 active:bg-blue-700 rounded-sm gap-2 p-6 text-xl bg-blue-500 min-w-8 h-8 flex items-center justify-center"
        >
          Stats
        </Link>
      </div>
      <h2 class="text-xl dark:text-white text-bold mt-24">
        Global Score Distribution
      </h2>
      <div class="w-full h-full max-w-xl relative">
        <div
          class="w-full max-h-full min-h-24 absolute aspect-video"
          ref={ref as Ref<HTMLDivElement>}
        >
          <BarGraph data={data} height={height}></BarGraph>
        </div>
      </div>
    </div>
  );
}

export function App() {
  const pathName = useLocation();
  const isBase = pathName.pathname === '/';

  return (
    <div class="p-8 pt-12 pb-[4.25rem] mx-0 my-auto text-center flex flex-col gap-5 w-full h-full">
      <LocationSaver />
      <Title />
      {isBase ? <MainPage /> : null}
      <Outlet />
    </div>
  );
}
