import './app.css';
import digitsTxt from '/digits.txt?raw';
import { DigitsGrid } from './digitsGrid';

const pi = digitsTxt.slice(2).split('').map(Number);

export function App() {
  return (
    <div class="flex flex-col gap-5">
      <h1 class="text-2xl">
        Learn{' '}
        <span class="[text-shadow:_0px_0px_5px_var(--tw-shadow-color)] shadow-gray-700 rounded-sm font-bold text-xl bg-blue-500 min-w-8 h-8 p-2 inline-flex items-center justify-center">
          1,000,000
        </span>{' '}
        digits of π
      </h1>
      <DigitsGrid pi={pi}></DigitsGrid>
      <div class="text-xl">
        <h1 class="font-bold text-2xl m-3 mt-20"> Controls</h1>
        <p>
          <span class="[text-shadow:_0px_0px_5px_var(--tw-shadow-color)] shadow-gray-700 rounded-sm font-bold text-xl bg-blue-500 min-w-8 h-8 p-2 inline-flex items-center justify-center">
            R
          </span>{' '}
          reset
        </p>
      </div>
    </div>
  );
}
