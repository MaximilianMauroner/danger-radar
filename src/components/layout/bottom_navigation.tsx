import {
  ShieldExclamationIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  MapIcon,
} from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import EmergencyModal from "../map/emergency_modal";

const BottomNavigation = () => {
  const iconClass = "m-auto w-8 h-8";
  const [showAccount, setShowAccount] = useState(true);
  const [showDangerModal, setShowEmergencyModal] = useState(false);
  useEffect(() => {
    if (window.location.pathname === "/account") {
      setShowAccount(false);
    }
  }, []);

  return (
    <>
      <nav
        id="bottom-navigation"
        className="fixed inset-x-0 bottom-0 z-10 block bg-rose-900 text-white dark:bg-slate-800"
      >
        <div id="tabs" className="relative flex justify-between">
          <div className={"inline-block w-full pt-2 pb-1 text-center"}>
            {showAccount ? (
              <Link
                href={"/account"}
                className="m-auto block w-min  hover:text-gray-300  focus:text-gray-300"
              >
                <UserIcon className={iconClass} />
                <span className="tab tab-home block text-xs">{"Account"}</span>
              </Link>
            ) : (
              <Link
                href={"/"}
                className="m-auto block w-min hover:text-gray-300 focus:text-gray-300"
              >
                <MapIcon className={iconClass} />
                <span className="tab tab-home block text-xs">{"Map"}</span>
              </Link>
            )}
          </div>
          <div className={"inline-block w-full pt-2 pb-1 text-center"}>
            <button
              onClick={() => signOut()}
              className="m-auto block w-auto hover:text-gray-300 focus:text-gray-300"
            >
              <ArrowRightOnRectangleIcon className={iconClass} />
              <span className="tab tab-home block text-xs">{"Sign Out"}</span>
            </button>
          </div>
          <div
            className={"absolute bottom-6 left-0 right-0 ml-auto mr-auto w-20"}
          >
            <button
              onClick={() => setShowEmergencyModal(true)}
              className={
                "bg-slate-00 h-20 w-20 rounded-full border-4 border-slate-800 bg-white text-red-500 "
              }
            >
              <ShieldExclamationIcon className={"m-auto h-16"} />
            </button>
          </div>
        </div>
      </nav>
      {showDangerModal ? (
        <EmergencyModal
          closeEmergencyModal={() => setShowEmergencyModal(false)}
        />
      ) : null}
    </>
  );
};
export default BottomNavigation;
