import { ShieldExclamationIcon, ArrowRightOnRectangleIcon, UserIcon } from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";


const BottomNavigation = () => {
  const iconClass = "m-auto h-8";

  return (
    <div className="w-full z-50">
      <section id="bottom-navigation"
               className="block fixed inset-x-0 bottom-0 z-10 dark:bg-indigo-600 bg-white dark:text-white">
        <div id="tabs" className="flex justify-between relative">
          <a href={"/account"}
             className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1">
            <UserIcon className={iconClass} />
            <span className="tab tab-home block text-xs">{"Account"}</span>
          </a>
          <div className={"absolute ml-auto mr-auto w-20 bottom-6 left-0 right-0"}>
            <button onClick={() => console.log("Danger")}
                    className={"text-red-500 rounded-full border-4 border-indigo-600 dark:bg-white h-20 w-20"}>
              <ShieldExclamationIcon className={"m-auto h-16"} />
              {/*<span className="tab tab-home block text-xs">{"Danger"}</span>*/}
            </button>
          </div>

          <button onClick={() => signOut()}
                  className="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1">
            <ArrowRightOnRectangleIcon className={iconClass} />
            <span className="tab tab-home block text-xs">{"Sign Out"}</span>
          </button>
        </div>
      </section>
    </div>
  );
};
export default BottomNavigation;