import { Title } from './title';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LocationSaver } from './customRouter';

function MainPage() {
  return (
    <div class="flex flex-col gap-5 items-center self-center w-fit">
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
      {/* <h2 class="font-bold mt-14 text-xl dark:text-white">Hosted on</h2>
      <div class="text-lg dark:text-white text-left w-fit grid grid-cols-2 gap-x-3 gap-y-1">
        <p class="text-right">Frontend</p>
        <a
          href="https://pages.github.com/"
          class="text-red-500 dark:text-red-400 hover:underline font-bold"
        >
          GitHub Pages
        </a>
        <p class="text-right">Backend</p>
        <a
          href="https://www.shuttle.rs/"
          class="text-red-500 dark:text-red-400 hover:underline font-bold"
        >
          shuttle.rs
        </a>
      </div> */}
    </div>
  );
}

export function App() {
  const pathName = useLocation();
  const isBase = pathName.pathname === '/';

  return (
    <div class="p-8 pb-[4.25rem] mx-0 my-auto text-center flex flex-col gap-5">
      <LocationSaver />
      <Title />
      {isBase ? <MainPage /> : null}
      <Outlet />
    </div>
  );
}
