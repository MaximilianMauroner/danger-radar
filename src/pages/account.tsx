import Head from "next/head";
import BottomNavigation from "../components/layout/bottom_navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import LoadingComponent from "../components/loading_component";

const encryptFriendLink: (id: string, remaining: number) => (string) = (id: string, remaining: number) => {
  if (remaining === 0) {
    return id;
  } else {
    id = Buffer.from(id).toString("base64");
  }
  return encryptFriendLink(id, remaining - 1);
};
const AccountPage = () => {
  const { data, status } = useSession({ required: true });
  const [name, setName] = useState<string>(data?.user?.name ? data?.user?.name : "");
  const {
    data: userData,
    isLoading
  } = trpc.user.getUser.useQuery({ id: data?.user?.id || "" }, {
    enabled: !!data?.user?.id, onSuccess: (data) => {
      if (data?.name) {
        setName(data?.name);
      }
    }
  });
  if (isLoading) {
    return <LoadingComponent title={"Danger Radar"} />;
  }
  let friendUrl = "";
  if (data?.user?.name) {
    friendUrl = window.location.origin + "/friend/add/" + encryptFriendLink(data?.user?.id, 5);
  }
  return (
    <>
      <Head>
        <title>Danger Radar</title>
        <meta name="description" content="Danger Radar" />
      </Head>
      <main className={"relative h-screen dark:bg-gray-900"}>
        {data?.user?.image ?
          <div className={"pt-3"}>
            <Image src={data?.user?.image} className={"m-auto rounded-full"} alt={"User"} width={100}
                   height={100} /></div> : null}
        <div className="w-full px-5 sm:px-0 m-auto sm:w-2/3 md:w-1/2">
          <label htmlFor="first-name" className="block text-sm font-medium dark:text-white text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="first-name"
            id="first-name"
            autoComplete="given-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className={"flex justify-center my-5"}>
          <button
            onClick={() => {
              navigator.share({
                title: "Add Friend",
                text: "Share this with a Friend to add them",
                url: friendUrl
              });
              navigator.clipboard.writeText(friendUrl);
            }}
            className={"dark:text-white w-max p-3 border dark:border-green-600 rounded-2xl dark:hover:bg-green-600"}>
            Add Friend
          </button>
        </div>
      </main>
      <BottomNavigation />
    </>
  );
};
export default AccountPage;