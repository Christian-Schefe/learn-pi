import { render } from 'preact';
import { App } from './app.tsx';
import './index.css';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { NotFound } from './notFound.tsx';
import { Stats } from './stats.tsx';
import { Play } from './play.tsx';
import { getSavedLocation } from './customRouter.tsx';

const savedLocation = getSavedLocation();
const opts = savedLocation
  ? {
      initialEntries: [savedLocation],
      initialIndex: 0,
    }
  : undefined;

const router = createMemoryRouter(
  [
    {
      path: '/',
      element: <App />,
      errorElement: <NotFound />,
      children: [
        {
          path: 'play',
          element: <Play />,
          errorElement: <NotFound />,
        },
        {
          path: 'stats',
          element: <Stats />,
          errorElement: <NotFound />,
        },
      ],
    },
  ],
  opts,
);

render(<RouterProvider router={router} />, document.getElementById('app')!);
