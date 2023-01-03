import Head from "next/head";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import BottomNavigation from "../components/layout/bottom_navigation";
import LoadingComponent from "../components/loading_component";
import type { NextPage } from "next";
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";
import * as PusherPushNotifications from "@pusher/push-notifications-web";
import { env } from "../env/client.mjs";
import { useEffect } from "react";

const Home: NextPage = () => {
  const BasicMapComponent = dynamic(
    () => import("../components/map/map_component"),
    {
      ssr: false,
      loading: () => <LoadingComponent title={"Danger Radar"} />,
    }
  );
  const router = useRouter();
  const { status } = useSession({
    required: true,
  });
  let beamsClient: PusherPushNotifications.Client | undefined = undefined;
  useEffect(() => {
    beamsClient = new PusherPushNotifications.Client({
      instanceId: env.NEXT_PUBLIC_PUSHER_BEAMS_CLIENT_KEY,
    });
  }, []);

  trpc.user.me.useQuery(undefined, {
    onSuccess: (user) => {
      if (user?.emergencyMode == true) {
        router.push("/?emergency=true");
      }
      if (user && beamsClient) {
        beamsClient
          .start()
          .then(() =>
            beamsClient
              ? beamsClient.addDeviceInterest("emergency-mode" + user.id)
              : null
          )
          .catch(console.error);
      }
    },
  });

  if (status === "loading") {
    return <LoadingComponent title={"Danger Radar"} />;
  }
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
export default Home;
