import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { z } from "zod";
import { trpc } from "../../../utils/trpc";
import Head from "next/head";
import Image from "next/image";
import Loading_component from "../../../components/loading_component";
import LoadingComponent from "../../../components/loading_component";

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
  const { status } = useSession({ required: true });
  const userId = decryptFriendLink(z.string().parse(friendcode ? friendcode : ""), 5);
  const { data: userData, isLoading } = trpc.user.getUser.useQuery({ id: userId ? userId : "" }, { enabled: !!userId });
  if (!friendcode || isLoading || !userData) {
    return <LoadingComponent title={"Add a Friend"} />;
  }

  return (
    <>
      <Head>
        <title>{"Add a Friend"}</title>
      </Head>
      <main className={"relative h-screen dark:bg-gray-900 dark:text-white"}>
        {userData?.image ?
          <div className={"pt-3"}>
            <Image src={userData?.image} className={"m-auto rounded-full"} alt={"User Image"} width={100}
                   height={100} /></div> : null}
        <h1 className={"text-center text-xl"}>{userData.name}</h1>
        <button
          className={"m-auto block my-3 dark:text-white p-3 dark:bg-green-600 rounded-2xl dark:hover:bg-green-600"}
          onClick={() => {
            console.log("add friend");
          }}
        >

          {["Add", userData.name, "as Friend"].join(" ")}
        </button>
      </main>
    </>
  );
};
export default Friendcode;