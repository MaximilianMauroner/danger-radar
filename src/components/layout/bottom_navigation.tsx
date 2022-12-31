import { ShieldExclamationIcon, ArrowRightOnRectangleIcon, UserIcon, MapIcon } from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";


const BottomNavigation = () => {
  const iconClass = "m-auto w-8 h-8";
  const [showAccount, setShowAccount] = useState(true);
  useEffect(() => {
    if (window.location.pathname === "/account") {
      setShowAccount(false);
    }
  }, []);

  return (
    <div className="w-full z-50">
      <section id="bottom-navigation"
               className="block fixed inset-x-0 bottom-0 z-10 dark:bg-slate-800 bg-white dark:text-white">
        <div id="tabs" className="flex justify-between relative">
          <div className={"w-full inline-block text-center pt-2 pb-1"}>
            {showAccount ? <Link href={"/account"}
                                 className="block w-min m-auto focus:text-gray-300 hover:text-gray-300">
                <UserIcon className={iconClass} />
                <span className="tab tab-home block text-xs">{"Account"}</span>
              </Link> :
              <Link href={"/"}
                    className="block w-min m-auto focus:text-gray-300 hover:text-gray-300">
                <MapIcon className={iconClass} />
                <span className="tab tab-home block text-xs">{"Map"}</span>
              </Link>
            }
          </div>
          <div className={"w-full inline-block text-center pt-2 pb-1"}>
            <button onClick={() => signOut()}
                    className="block w-auto m-auto focus:text-gray-300 hover:text-gray-300">
              <ArrowRightOnRectangleIcon className={iconClass} />
              <span className="tab tab-home block text-xs">{"Sign Out"}</span>
            </button>
          </div>
          <div className={"absolute ml-auto mr-auto w-20 bottom-6 left-0 right-0"}>
            <button onClick={() => console.log("Danger")}
                    className={"text-red-500 rounded-full border-4 border-slate-800 dark:bg-white h-20 w-20"}>
              <ShieldExclamationIcon className={"m-auto h-16"} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
export default BottomNavigation;