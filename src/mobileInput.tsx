const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

export const DigitButtonRow = (props: {
  callback: (digit: number) => void;
}) => {
  const buttons = digits.map(digit => (
    <DigitButton digit={digit} callback={props.callback} />
  ));
  return (
    <div class="fixed p-1 bottom-0 left-0 right-0 h-auto flex justify-center gap-1 bg-[#242424]">
      {buttons}
    </div>
  );
};

export const DigitButton = (props: {
  digit: number;
  callback: (digit: number) => void;
}) => {
  return (
    <button
      class="w-12 h-12 font-bold flex text-xl items-center justify-center bg-blue-500 hover:bg-blue-600 rounded-sm"
      onClick={() => props.callback(props.digit)}
    >
      {props.digit}
    </button>
  );
};
