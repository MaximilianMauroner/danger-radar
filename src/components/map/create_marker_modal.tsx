import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { trpc } from "../../utils/trpc";
import type { LatLng } from "leaflet";
import { useMap } from "react-leaflet";
import { MarkerLevel, MarkerType } from "@prisma/client";
import { z } from "zod";

const CreateMarkerModal = ({
                             modalOpen,
                             closeModal,
                             markerPosition,
                             refetch
                           }: {
  modalOpen: boolean;
  closeModal: () => void;
  markerPosition: LatLng;
  refetch: () => void;
}) => {
  const [isDanger, setIsDanger] = useState(true);
  const makeMarker = trpc.marker.addMarker.useMutation();
  const cancelButtonRef = useRef(null);
  const [message, setMessage] = useState("");
  const [level, setLevel] = useState("MEDIUM");
  const formatLatLng = (pos: number) => {
    return pos.toFixed(5);
  };
  const map = useMap();
  const saveForm = () => {
    makeMarker.mutate(
      {
        lat: markerPosition.lat,
        lng: markerPosition.lng,
        zoomLevel: map.getZoom(),
        message: message,
        markerLevel: z.nativeEnum(MarkerLevel).parse(level),
        type: isDanger ? MarkerType.DANGER : MarkerType.SAFETY
      },
      {
        onSuccess: () => {
          refetch();
          closeModal();
        }
      }
    );
  };
  const dynamicString = (dangerString: string, safetyString: string) => {
    if (isDanger) {
      return dangerString;
    } else {
      return safetyString;
    }
  };
  return (
    <Transition.Root show={modalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-40"
        initialFocus={cancelButtonRef}
        onClose={closeModal}
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
              <Dialog.Panel
                className="relative w-full transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <ul
                    className="mb-5 flex divide-x divide-gray-200 rounded-lg text-center text-sm font-medium shadow sm:flex">
                    <li className="w-full">
                      <button
                        onClick={() => setIsDanger(true)}
                        className="active inline-block w-full rounded-l-lg bg-red-700 p-4 text-white focus:ring-0"
                      >
                        Danger
                      </button>
                    </li>
                    <li className="w-full">
                      <button
                        onClick={() => setIsDanger(false)}
                        className="inline-block w-full rounded-r-lg bg-green-700 p-4 text-white focus:ring-0"
                      >
                        Safety
                      </button>
                    </li>
                  </ul>


                  <div className="sm:flex sm:items-start">
                    <div
                      className={
                        "mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 " +
                        dynamicString("bg-red-100", "bg-green-100")
                      }
                    >
                      <ExclamationTriangleIcon
                        className={
                          "h-6 w-6 " +
                          dynamicString("text-red-600", "text-green-600")
                        }
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Add {dynamicString("Danger", "Safety")} Marker
                      </Dialog.Title>
                      <div className="mt-2 w-full">
                        <p
                          className={
                            "my-3 flex w-full flex-col rounded-xl text-sm text-gray-500"
                          }
                        >
                          <span>
                            Latitude: {formatLatLng(markerPosition.lat)}
                          </span>
                          <span>
                            Longitude: {formatLatLng(markerPosition.lng)}
                          </span>
                        </p>
                      </div>
                      <div>
                        <h3
                          className="block pb-1 text-sm font-medium text-gray-700"
                        >
                          {dynamicString("Danger", "Safety") + " Level"}
                        </h3>
                        <ul
                          className="mb-5 flex gap-1 rounded-lg text-center text-sm font-medium shadow sm:flex">
                          <li
                            className={["w-full", level === "LOW" ? "outline outline-slate-900  rounded-l-lg" : ""].join(" ")}>
                            <button
                              onClick={() => setLevel("LOW")}
                              className={
                                "inline-block w-full rounded-l-lg p-4 text-white focus:ring-0 " +
                                dynamicString("bg-rose-400  hover:bg-rose-300", "bg-emerald-400  hover:bg-emerald-300")
                              }
                            >
                              Low
                            </button>
                          </li>
                          <li
                            className={["w-full", level === "MEDIUM" ? "outline outline-slate-900" : ""].join(" ")}>
                            <button
                              onClick={() => setLevel("MEDIUM")}
                              className={
                                "inline-block w-full p-4 text-white focus:ring-0 " +
                                dynamicString("bg-rose-600  hover:bg-rose-500", "bg-emerald-600  hover:bg-emerald-500")
                              }
                            >
                              Medium
                            </button>
                          </li>
                          <li
                            className={["w-full", level === "HIGH" ? "outline outline-slate-900  rounded-r-lg" : ""].join(" ")}>
                            <button
                              onClick={() => setLevel("HIGH")}
                              className={
                                "inline-block w-full rounded-r-lg p-4 text-white focus:ring-0 " +
                                dynamicString("bg-rose-900  hover:bg-rose-800", "bg-emerald-900  hover:bg-emerald-800")
                              }
                            >
                              High
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <label
                          htmlFor="about"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Description
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="about"
                            name="description"
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder={"Brief description of the situation"}
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
                      "inline-flex w-full justify-center rounded-md border border-transparent  px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2  focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm " +
                      dynamicString(
                        "bg-red-600 hover:bg-red-700 focus:ring-red-500",
                        "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                      )
                    }
                    onClick={() => saveForm()}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => closeModal()}
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
export default CreateMarkerModal;
