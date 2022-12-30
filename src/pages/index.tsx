import { GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
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
      <main className={"relative h-screen"}>
        <BasicMapComponent />
      </main>
      <BottomNavigation />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false
      }
    };
  }
  return {
    props: { session }
  };
};
export default Home;