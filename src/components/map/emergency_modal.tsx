import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";

const EmergencyModal = ({
  closeEmergencyModal,
}: {
  closeEmergencyModal: () => void;
}) => {
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);
  const router = useRouter();
  const emergencyMutation = trpc.user.enableEmergencyMode.useMutation({
    onSuccess: () => {
      closeEmergencyModal();
      router.push("/?emergency=true");
    },
  });

  const enableEmergencyMode = () => {
    emergencyMutation.mutate();
  };
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={closeEmergencyModal}
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 dark:bg-slate-800 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-16 sm:w-16">
                      <ShieldExclamationIcon
                        className="h-12 w-12 text-red-600 dark:text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-2xl font-bold leading-6 text-red-600"
                      >
                        Enter Emergency Mode
                      </Dialog.Title>
                      <div className="mt-3">
                        <ul
                          className={
                            "list-disc pl-5 font-medium text-red-600 dark:text-red-500"
                          }
                        >
                          <li>
                            You will be sharing your location every 5 seconds
                            until the emergency mode is turned off
                          </li>
                          <li>Your Emergency Contacts will be notified</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 dark:bg-slate-700 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    onClick={() => enableEmergencyMode()}
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Activate
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => closeEmergencyModal()}
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
  );
};
export default EmergencyModal;
