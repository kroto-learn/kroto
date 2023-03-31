import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  return (
    <div className="">
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
