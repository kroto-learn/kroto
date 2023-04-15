import Head from "next/head";
import { DashboardLayout } from ".";
import { api } from "@/utils/api";

const Audience = () => {
  const { data: audience, isLoading } =
    api.creator.getAudienceMembers.useQuery();
  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <Head>
        <title>Audience | Dashboard</title>
      </Head>
      <pre>{JSON.stringify(audience, null, 2)}</pre>
    </>
  );
};

export default Audience;

Audience.getLayout = DashboardLayout;
