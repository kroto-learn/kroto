export default function Loading() {
  return (
    <div className="relative h-10 w-10 border-2 border-neutral-700 bg-neutral-800">
      <div className="absolute h-10 w-10 animate-ping border-2 border-neutral-600 opacity-75"></div>
    </div>
  );
}
