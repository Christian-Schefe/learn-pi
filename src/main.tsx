import { render } from 'preact';
import { App } from './app.tsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { NotFound } from './notFound.tsx';
import { Stats } from './stats.tsx';
import { Play } from './play.tsx';

const router = createBrowserRouter([
  {
    path: '/learn-pi',
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
]);

render(<RouterProvider router={router} />, document.getElementById('app')!);
