import { type NextPage } from "next";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";
import dynamic from "next/dynamic";

const Home: NextPage = () => {
  const BasicMapComponent = dynamic(() => import("../components/map/map_component"), {
    ssr: false,
    loading: () => <p>Loading...</p>
  });
  const { data, status } = useSession();


  return (
    <>
      <Head>
        <title>Danger Radar</title>
        <meta name="description" content="Danger Radar" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {data ? <BasicMapComponent /> : <button onClick={() => signIn("discord")}>Sign in</button>}
    </>
  );
};

export default Home;