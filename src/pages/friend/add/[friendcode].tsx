import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { z } from "zod";
import { trpc } from "../../../utils/trpc";
import Head from "next/head";
import Image from "next/image";
import Loading_component from "../../../components/loading_component";
import LoadingComponent from "../../../components/loading_component";
import Link from "next/link";
import { env } from "../../../env/client.mjs";

const decryptFriendLink: (id: string, remaining: number) => (string) = (id: string, remaining: number) => {
  if (remaining === 0) {
    return id;
  } else {
    id = Buffer.from(id, "base64").toString("ascii");
  }
  return decryptFriendLink(id, remaining - 1);
};
const Friendcode = () => {
  const router = useRouter();
  const { friendcode } = router.query;
  const { data: sessionData, status } = useSession({ required: true });
  const userId = decryptFriendLink(z.string().parse(friendcode ? friendcode : ""), env.NEXT_PUBLIC_ENCRYPTION_COUNT);
  const {
    data: selfData,
    isLoading: isSelfLoading
  } = trpc.user.getUser.useQuery({ id: sessionData?.user?.id ? sessionData?.user?.id : "" }, { enabled: !!sessionData?.user?.id });
  const {
    data: friendData,
    isLoading
  } = trpc.user.getUser.useQuery({ id: userId ? userId : "" }, { enabled: !!userId });
  const addFriendMutation = trpc.user.addFriend.useMutation();
  if (userId == sessionData?.user?.id) {
    router.push("/");
  }
  if (!friendcode || isLoading || isSelfLoading || !friendData || !userId) {
    return <LoadingComponent title={"Add a Friend"} />;
  }
  if (selfData?.friends?.find(e => e.id === userId)) {
    return (<>
      <Head>
        <title>{"Already Friends with " + friendData.name}</title>
      </Head>
      <main className={"relative h-screen dark:bg-gray-900 dark:text-white flex flex-col justify-center items-center"}>
        <h1 className={"text-center text-xl"}> {"Already Friends with"} <b
          className={"text-green-300"}>{friendData.name}</b></h1>
        <Link className={"pt-4 text-gray-300 underline"} href={"/"}> Home</Link>
      </main>
    </>);
  }
  return (
    <>
      <Head>
        <title>{"Add a Friend"}</title>
      </Head>
      <main className={"relative h-screen dark:bg-gray-900 dark:text-white"}>
        {friendData?.image ?
          <div className={"pt-3"}>
            <Image src={friendData?.image} className={"m-auto rounded-full"} alt={"User Image"} width={100}
                   height={100} /></div> : null}
        <h1 className={"text-center text-xl"}>{friendData.name}</h1>
        <button
          className={"m-auto block my-3 dark:text-white p-3 dark:bg-green-600 rounded-2xl dark:hover:bg-green-600"}
          onClick={() => {
            addFriendMutation.mutate({ userId: userId });
          }}
        >

          {["Add", friendData.name, "as Friend"].join(" ")}
        </button>
      </main>
    </>);
};
export default Friendcode;