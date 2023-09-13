import Head from "next/head";
import BottomNavigation from "../components/layout/bottom_navigation";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Fragment, useRef, useState } from "react";
import { trpc } from "../utils/trpc";
import LoadingComponent from "../components/loading_component";
import { env } from "../env/client.mjs";
import type { Friend, User } from "@prisma/client";
import { Dialog, Transition } from "@headlessui/react";
import { BugAntIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import Link from "next/link";

const encryptFriendLink: (id: string, remaining: number) => string = (
  id: string,
  remaining: number
) => {
  if (remaining === 0) {
    return id;
  } else {
    id = Buffer.from(id).toString("base64");
  }
  return encryptFriendLink(id, remaining - 1);
};
const AccountPage = () => {
  const { data } = useSession({ required: true });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [name, setName] = useState<string>(
    data?.user?.name ? data?.user?.name : ""
  );
  const {
    data: userData,
    isLoading,
    refetch,
  } = trpc.user.me.useQuery(undefined, {
    onSuccess: (data) => {
      if (data?.name) {
        setName(data?.name);
      }
    },
  });
  const mutation = trpc.user.managePermissions.useMutation();

  const mumtatePermissions = (
    friendId: string,
    allowLocationSharing: boolean,
    emergencyContact: boolean
  ) => {
    mutation.mutate(
      {
        friendId: friendId,
        isEmergencyContact: allowLocationSharing,
        allowLocationSharing: emergencyContact,
      },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };
  const checkNavigaorPermissions = (friendUrl: string) => {
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      if (result.state === "granted") {
        if (navigator.share != undefined) {
          navigator.share({
            title: "Add Friend",
            text: "Share this with a Friend to add them",
            url: friendUrl,
          });
        }
        navigator.clipboard.writeText(friendUrl);
      } else if (result.state === "prompt") {
      }
    });
  };
  if (isLoading) {
    return <LoadingComponent title={"Danger Radar"} />;
  }
  let friendUrl = "";
  if (data?.user?.name) {
    friendUrl =
      window.location.origin +
      "/friend/add/" +
      encryptFriendLink(data?.user?.id, env.NEXT_PUBLIC_ENCRYPTION_COUNT);
  }
  return (
    <>
      <Head>
        <title>Danger Radar</title>
        <meta name="description" content="Danger Radar" />
      </Head>
      <main className={"relative min-h-screen pb-24 dark:bg-gray-900"}>
        {data?.user?.image ? (
          <div className={"pt-3"}>
            <Image
              src={data?.user?.image}
              className={"m-auto rounded-full"}
              alt={"User"}
              width={100}
              height={100}
            />
          </div>
        ) : null}
        <div className="m-auto w-full p-5 sm:w-2/3 sm:py-5 sm:px-0 md:w-1/2">
          <span className="block text-sm font-medium text-gray-700 dark:text-white">
            Name
          </span>
          <span
            className={
              "block text-2xl font-bold text-slate-900 dark:text-white"
            }
          >
            {name}
          </span>
        </div>
        <DeleteAccountModal />
        <div className="m-auto mb-20 w-full px-3 pt-5 sm:w-2/3 sm:px-0 md:w-1/2">
          <span
            className={
              "block text-3xl font-bold text-emerald-600 dark:text-emerald-400"
            }
          >
            {"Friends"}
          </span>
          <div className={"flex flex-col"}>
            {userData?.userFriendsRecords.map((friend) => (
              <div key={friend.friendId}>
                <ManageFriends
                  friend={friend}
                  mumtatePermissions={mumtatePermissions}
                />
              </div>
            ))}
          </div>
          <div className={"my-5 flex flex-col items-center gap-3"}>
            <button
              onClick={() => {
                checkNavigaorPermissions(friendUrl);
              }}
              className={
                "mx-auto block flex items-center justify-between rounded-xl bg-green-700 p-4 text-center text-white"
              }
            >
              Add Friend
            </button>
          </div>
        </div>
        <Miscellaneous />
      </main>
      <BottomNavigation />
    </>
  );
};

const ManageFriends = ({
  friend,
  mumtatePermissions,
}: {
  friend: Friend & { friend: User };
  mumtatePermissions: (
    friendId: string,
    allowLocationSharing: boolean,
    emergencyContact: boolean
  ) => void;
}) => {
  const [allowLocationSharing, setAllowLocationSharing] = useState<boolean>(
    friend.allowLocationSharing
  );
  const [emergencyContact, setEmergencyContact] = useState<boolean>(
    friend.isEmergencyContact
  );

  const updatePermissions = (location: boolean, emContact: boolean) => {
    mumtatePermissions(friend.friendId, location, emContact);
    setAllowLocationSharing(location);
    setEmergencyContact(emContact);
  };
  return (
    <div className={" m-auto my-2 w-full rounded-xl dark:bg-slate-800"}>
      <p
        className={
          "text-center text-center text-xl font-semibold dark:text-slate-300"
        }
      >
        {friend.friend.name}
      </p>
      <div className={"flex items-center justify-center gap-2.5 py-2"}>
        <label className="inline-flex cursor-pointer items-center">
          <span className="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            Share Location
          </span>
          <div className={"relative inline-flex cursor-pointer items-center"}>
            <input
              type="checkbox"
              value=""
              className="peer sr-only"
              checked={allowLocationSharing}
              onChange={() =>
                updatePermissions(!allowLocationSharing, emergencyContact)
              }
            />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-0 dark:border-gray-600 dark:bg-gray-700"></div>
          </div>
        </label>
      </div>
      <div className={"flex justify-center gap-2.5 py-2"}>
        <label className="inline-flex cursor-pointer items-center">
          <span className="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            Emergency Contact
          </span>
          <div className={"relative inline-flex cursor-pointer items-center"}>
            <input
              type="checkbox"
              value=""
              className="peer sr-only"
              checked={emergencyContact}
              onChange={() =>
                updatePermissions(allowLocationSharing, !emergencyContact)
              }
            />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-0 dark:border-gray-600 dark:bg-gray-700"></div>
          </div>
        </label>
      </div>
    </div>
  );
};

const Miscellaneous = () => {
  const [isOpen, setIsOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  const feedbackMutation = trpc.feedback.add.useMutation({
    onSuccess: () => setIsOpen(false),
  });
  const [message, setMessage] = useState("");

  const saveForm = () => {
    feedbackMutation.mutate({ message: message });
  };
  return (
    <>
      <button
        className={
          "mx-auto block flex items-center justify-between rounded-xl border border-gray-300 bg-white p-4 text-center dark:border-gray-700 dark:bg-gray-700 dark:text-white"
        }
        onClick={() => setIsOpen(true)}
      >
        <BugAntIcon className={"mr-2 block w-6"} />
        <span> Give Feedback</span>
      </button>
      <div className={"flex w-full items-center justify-center p-4"}>
        <Link
          href="https://www.buymeacoffee.com/MaximilianMaur"
          target="_blank"
        >
          <Image
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
            unoptimized={true}
            alt="Buy Me A Coffee"
            width={"198"}
            height={"55"}
          />
        </Link>
      </div>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40"
          initialFocus={cancelButtonRef}
          onClose={setIsOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative w-full transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          Give Feedback
                        </Dialog.Title>
                        <div>
                          <div className="mt-1">
                            <textarea
                              id="about"
                              name="description"
                              rows={3}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              placeholder={"Brief description of your feedback"}
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className={
                        "inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none  focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                      }
                      onClick={() => saveForm()}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setIsOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

const DeleteAccountModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  const router = useRouter();
  const deleteAccountMutation = trpc.user.deleteAccount.useMutation({
    onSuccess: () => {
      router.push("/auth/signin");
    },
  });
  return (
    <>
      <button
        className={
          "mx-auto block flex items-center justify-between rounded-xl bg-red-700 p-4 text-center text-white"
        }
        onClick={() => setIsOpen(true)}
      >
        <TrashIcon className={"mr-2 block w-6"} />
        <span> Delete Account</span>
      </button>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40"
          initialFocus={cancelButtonRef}
          onClose={setIsOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative w-full transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mb-1 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          Delete Account
                        </Dialog.Title>
                      </div>
                    </div>
                    <div className="mt-3">
                      <ul className={"list-disc pl-5"}>
                        <li>
                          All your data will be deleted <b>immediately</b>
                        </li>
                        <li>
                          Your Account will be deleted <b>immediately</b>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className={
                        "inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none  focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                      }
                      onClick={() => deleteAccountMutation.mutate()}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setIsOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};
export default AccountPage;
