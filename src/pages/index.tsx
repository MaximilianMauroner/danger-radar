import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import BottomNavigation from "../components/layout/bottom_navigation";

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
      {data ? (<>
        <button onClick={() => signOut()}> SignOut</button>
        <BasicMapComponent />
      </>) : <button onClick={() => signIn()}>Sign in</button>}
      <BottomNavigation />
    </>
  );
};

export default Home;