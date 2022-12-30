import { LockClosedIcon } from "@heroicons/react/20/solid";
import { signIn } from "next-auth/react";

const signInProviders = [
  { provider: "google", name: "Google", icon: <LockClosedIcon /> },
  { provider: "instagram", name: "Instagram", icon: <LockClosedIcon /> },
  { provider: "discord", name: "discord", icon: <LockClosedIcon /> }
];
const SignIn = () => {
  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-50">
        <body class="h-full">
        ```
      */}
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <button
            onClick={() => signIn("google")}
            className="flex w-full justify-center rounded-3xl border-none bg-white p-1 text-black hover:bg-gray-200 sm:p-2">
            <img src="https://freesvg.org/img/1534129544.png" className="mr-2 w-6 object-fill" />Sign in with Google
          </button>

        </div>
      </div>
    </>
  );
};
// const signInButton


export default SignIn;

