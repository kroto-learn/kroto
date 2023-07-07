const Switch = ({
  value,
  onClick,
}: {
  value: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      className={`flex  h-[1.2rem] w-[2.4rem] cursor-pointer items-center rounded-full border border-neutral-700 p-px ${
        value ? "justify-end bg-pink-600" : "justify-start bg-neutral-800"
      }`}
      onClick={onClick}
    >
      <div className="aspect-square h-full rounded-full bg-neutral-200" />
    </button>
  );
};

export default Switch;
