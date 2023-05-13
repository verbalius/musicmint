import s from "./styles.module.css";
import { toast } from "react-toastify";

const CounterInput = ({
  value,
  setValue,
  maxValue,
}: {
  value: number;
  setValue: (prop: number) => void;
  maxValue?: string | undefined;
}) => {
  const handleIncrement = () => {
    if (!maxValue) {
      return;
    }
    if (+maxValue <= +(value + 0.05).toFixed(3)) {
      toast.warning("Balance limit");
      return;
    }
    setValue(+(value + 0.05).toFixed(3));
  };

  const handleDecrement = () => {
    if (+(value - 0.05).toFixed(3) <= 0) {
      toast.warning("Donation should be more then zero");
      return;
    }
    setValue(+(value - 0.05).toFixed(3));
  };

  return (
    <div className="border border-[#E2E4E8] w-full">
      <div className="flex flex-row w-full h-full rounded-lg relative bg-transparent">
        <button
          data-action="decrement"
          className="px-4 bg-transparent text-gray-600 hover:text-gray-700 hover:bg-gray-100 h-full cursor-pointer outline-none"
          onClick={handleDecrement}
        >
          <span className="m-auto text-2xl font-thin">−</span>
        </button>
        <input
          type="number"
          className={s.input}
          value={+value}
          onChange={(e) => setValue(+e.target.value)}
        />
        <button
          data-action="increment"
          className="px-4 bg-transparent text-gray-600 hover:text-gray-700 hover:bg-gray-100 h-full cursor-pointer"
          onClick={handleIncrement}
        >
          <span className="m-auto text-2xl font-thin">+</span>
        </button>
      </div>
    </div>
  );
};

export default CounterInput;
