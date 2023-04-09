export const Bar = ({
  animationDuration,
  progress,
}: {
  animationDuration: number;
  progress: number;
}) => (
  <div
    className="fixed left-0 top-0 z-50 h-1 w-full bg-pink-500 blur-[2px]"
    style={{
      marginLeft: `${(-1 + progress) * 100}%`,
      transition: `margin-left ${animationDuration}ms linear`,
    }}
  ></div>
);
