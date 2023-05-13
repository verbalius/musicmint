const CounterInput = ({
  value,
  setValue,
}: {
  value: number;
  setValue: (prop: number) => void;
}) => {
  return (
    <div className="border border-[#E2E4E8]">
      <div className="flex flex-row h-full w-full rounded-lg relative bg-transparent ">
        <button
          data-action="decrement"
          className="bg-transparent text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none"
        >
          <span className="m-auto text-2xl font-thin">−</span>
        </button>
        <input
          type="number"
          className="outline-none focus:outline-none text-center w-full bg-transparent font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700  outline-none"
          name="custom-input-number"
          value={value}
          onChange={(e) => setValue(+e.target.value)}
        ></input>
        <button
          data-action="increment"
          className="bg-transparent text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer"
        >
          <span className="m-auto text-2xl font-thin">+</span>
        </button>
      </div>
    </div>
  );
};

export default CounterInput;
