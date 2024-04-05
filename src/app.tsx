import { Title } from './title';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { BASE_URL } from './utils/consts';

function MainPage() {
  return (
    <div class="flex flex-col gap-5 items-center self-center w-fit">
      <h2 class="font-bold mt-8 text-xl dark:text-white">About</h2>
      <p class="text-lg dark:text-white text-left w-full">
        How many digits of Pi can you remember?
        <br />
        Do you want to learn more about Pi?
        <br />
        Press play to find out!
      </p>
      <div class="w-fit flex gap-2">
        <Link
          to="play"
          class="text-white w-24 font-bold hover:bg-blue-600 active:bg-blue-700 rounded-sm gap-2 p-6 text-xl bg-blue-500 min-w-8 h-8 flex items-center justify-center"
        >
          Play
        </Link>
        <Link
          to="stats"
          class="text-white w-24 font-bold hover:bg-blue-600 active:bg-blue-700 rounded-sm gap-2 p-6 text-xl bg-blue-500 min-w-8 h-8 flex items-center justify-center"
        >
          Stats
        </Link>
      </div>
      <p class="text-lg dark:text-white text-left w-full">
        Frontend hosted on <a href="https://pages.github.com/" class="text-red-500 dark:text-red-400 hover:underline">GitHub Pages</a>.
        <br />
        Backend hosted on <a href="https://www.shuttle.rs/" class="text-red-500 dark:text-red-400 hover:underline">shuttle.rs</a>.
        <br />
        Monthly costs:
        <span class="ml-2 text-white rounded-sm font-bold bg-blue-500 min-w-8 px-2 inline-flex items-center justify-center">
          $0.00
        </span>
      </p>
    </div>
  );
}

export function App() {
  const pathName = useLocation();
  const isBase = pathName.pathname.endsWith(BASE_URL);

  return (
    <div class="p-8 pb-[4.25rem] mx-0 my-auto text-center flex flex-col gap-5">
      <Title />
      {isBase ? <MainPage /> : null}
      <Outlet />
    </div>
  );
}
