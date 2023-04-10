export default function LoginFlowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-3">
      <div className="bg-neutral-800"></div>
      <div className="col-span-2 bg-neutral-900">{children}</div>
    </div>
  );
}
