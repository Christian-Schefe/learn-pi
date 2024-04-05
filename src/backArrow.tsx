import { Link, useNavigate } from 'react-router-dom';
import arrowSvg from '/backarrow.svg';
import { BASE_URL } from './utils/consts';
import { KeyboardListener } from './keyboardListener';

export const BackArrow = (props: { to: string }) => {
  const navigate = useNavigate();
  const path = BASE_URL + props.to;

  const redirect = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      navigate(path);
    }
  };

  return (
    <div class="text-white fixed p-1 top-2 left-2 flex justify-center gap-1">
      <Link
        to={path}
        class="w-6 h-6 font-bold flex text-xl items-center justify-center rounded-sm"
      >
        <img src={arrowSvg} class="dark:invert"></img>
      </Link>
      <KeyboardListener callback={redirect} />
    </div>
  );
};
