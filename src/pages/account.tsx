import Head from "next/head";
import BottomNavigation from "../components/layout/bottom_navigation";
import {useSession} from "next-auth/react";
import Image from "next/image";
import {useState} from "react";
import {trpc} from "../utils/trpc";
import LoadingComponent from "../components/loading_component";
import {env} from "../env/client.mjs";
import type {Friend, User} from "@prisma/client";

const encryptFriendLink: (id: string, remaining: number) => (string) = (id: string, remaining: number) => {
    if (remaining === 0) {
        return id;
    } else {
        id = Buffer.from(id).toString("base64");
    }
    return encryptFriendLink(id, remaining - 1);
};
const AccountPage = () => {
    const {data} = useSession({required: true});
    const [name, setName] = useState<string>(data?.user?.name ? data?.user?.name : "");
    const {
        data: userData,
        isLoading,
        refetch
    } = trpc.user.me.useQuery(undefined, {
        onSuccess: (data) => {
            if (data?.name) {
                setName(data?.name);
            }
        }
    });
    const mutation = trpc.user.managePermissions.useMutation();

    const mumtatePermissions = (friendId: string, allowLocationSharing: boolean, emergencyContact: boolean) => {
        mutation.mutate({
            friendId: friendId,
            isEmergencyContact: allowLocationSharing,
            allowLocationSharing: emergencyContact
        }, {
            onSuccess: () => {
                refetch();
            }
        });
    };
    if (isLoading) {
        return <LoadingComponent title={"Danger Radar"}/>;
    }
    let friendUrl = "";
    if (data?.user?.name) {
        friendUrl = window.location.origin + "/friend/add/" + encryptFriendLink(data?.user?.id, env.NEXT_PUBLIC_ENCRYPTION_COUNT);
    }
    return (
        <>
            <Head>
                <title>Danger Radar</title>
                <meta name="description" content="Danger Radar"/>
            </Head>
            <main className={"relative h-screen dark:bg-gray-900"}>
                {data?.user?.image ?
                    <div className={"pt-3"}>
                        <Image src={data?.user?.image} className={"m-auto rounded-full"} alt={"User"} width={100}
                               height={100}/></div> : null}
                <div className="w-full p-5 sm:py-5 sm:px-0 m-auto sm:w-2/3 md:w-1/2">
          <span className="block text-sm font-medium dark:text-white text-gray-700">
            Name
          </span>
                    <span className={"block text-2xl font-bold dark:text-white text-gray-700"}>
            {name}
          </span>
                </div>
                <div className="w-full px-3 sm:px-0 m-auto sm:w-2/3 md:w-1/2 pt-5">
        <span className={"block text-3xl font-bold dark:text-emerald-400 text-gray-700"}>
        {"Friends"}
        </span>
                    <div className={"flex flex-col"}>
                        {userData?.userFriendsRecords.map((friend) => (
                            <div key={friend.friendId}>
                                <ManageFriends friend={friend} mumtatePermissions={mumtatePermissions}/>
                            </div>
                        ))}
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
                </div>
            </main>
            <BottomNavigation/>
        </>
    );
};

const ManageFriends = ({friend, mumtatePermissions}: {
    friend: Friend & { friend: User },
    mumtatePermissions: (friendId: string, allowLocationSharing: boolean, emergencyContact: boolean) => void
}) => {
    const [allowLocationSharing, setAllowLocationSharing] = useState<boolean>(friend.allowLocationSharing);
    const [emergencyContact, setEmergencyContact] = useState<boolean>(friend.isEmergencyContact);


    const updatePermissions = (location: boolean, emContact: boolean) => {
        mumtatePermissions(friend.friendId, location, emContact);
        setAllowLocationSharing(location);
        setEmergencyContact(emContact);
    };
    return (
        <div className={" my-2 dark:bg-slate-800 w-full m-auto rounded-xl"}>
            <p className={"text-center dark:text-slate-300 font-semibold text-xl text-center"}>{friend.friend.name}</p>
            <div className={"flex gap-2.5 justify-center items-center py-2"}>
                <label className="inline-flex items-center cursor-pointer">
                    <span className="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">Share Location</span>
                    <div className={"relative inline-flex items-center cursor-pointer"}>
                        <input type="checkbox" value="" className="sr-only peer" checked={allowLocationSharing}
                               onChange={() => updatePermissions(!allowLocationSharing, emergencyContact)}/>
                        <div
                            className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-0 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                    </div>
                </label>
            </div>
            <div className={"flex gap-2.5 justify-center py-2"}>
                <label className="inline-flex items-center cursor-pointer">
                    <span className="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">Emergency Contact</span>
                    <div className={"relative inline-flex items-center cursor-pointer"}>
                        <input type="checkbox" value="" className="sr-only peer" checked={emergencyContact}
                               onChange={() => updatePermissions(allowLocationSharing, !emergencyContact)}/>
                        <div
                            className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-0 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                    </div>
                </label>
            </div>
        </div>
    );
};
export default AccountPage;