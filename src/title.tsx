import { ThemeToggle } from './theme';
import piSvg from '/pi.svg';

export const Title = () => {
  return (
    <h1 class="text-2xl dark:text-white">
      Learn{' '}
      <span class="text-white rounded-sm font-bold text-xl bg-blue-500 min-w-8 h-8 p-2 inline-flex items-center justify-center">
        1,000,000
      </span>{' '}
      digits of <img class="inline-block w-6 h-6 ml-1" src={piSvg}></img>
      <ThemeToggle></ThemeToggle>
    </h1>
  );
};
