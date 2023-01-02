import Head from "next/head";
import {useSession} from "next-auth/react";
import dynamic from "next/dynamic";
import BottomNavigation from "../components/layout/bottom_navigation";
import LoadingComponent from "../components/loading_component";
import type {NextPage} from "next";

const Home: NextPage = () => {
    const BasicMapComponent = dynamic(() => import("../components/map/map_component"), {
        ssr: false,
        loading: () => <LoadingComponent title={"Danger Radar"}/>
    });
    const {status} = useSession({
        required: true
    });
    if (status === "loading") {
        return <LoadingComponent title={"Danger Radar"}/>;
    }

    return (
        <>
            <Head>
                <title>Danger Radar</title>
                <meta name="description" content="Danger Radar"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className={"relative h-screen"}>
                <BasicMapComponent/>
            </main>
            <BottomNavigation/>

        </>
    );
};
export default Home;