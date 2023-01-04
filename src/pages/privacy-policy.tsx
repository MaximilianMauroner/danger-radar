import Head from "next/head";
import Link from "next/link";

const PrivacyPolicy = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy</title>
      </Head>
      <main className={"h-screen w-full bg-gray-900 text-white"}>
        <div className={"m-auto p-5 sm:w-2/3 sm:p-0"}>
          <div className={"pb-4"}>
            <h1 className={"pb-2 pt-3 text-2xl font-bold text-sky-800"}>
              Privacy Policy
            </h1>
            <p>
              This privacy policy explains how we collect, use, and share your
              data when you use the app.
            </p>
          </div>
          <div>
            <h2 className={"pb-2 pt-3 text-xl font-bold text-sky-800"}>
              Information We Collect
            </h2>
            <span>
              We collect a variety of information from and about you when you
              use our app. This may include:
            </span>
            <ul className={"list-disc pl-5 pb-2 font-thin"}>
              <li>Contact information, such as your name, email address.</li>
              <li>
                Location data, including your GPS location and information about
                the device you are using.
              </li>
            </ul>
          </div>
          <div>
            <h2 className={"pb-2 pt-3 text-xl font-bold text-sky-800"}>
              How We Use Your Information
            </h2>
            <span>
              We use the information we collect from and about you to provide,
              maintain, and improve our app, as well as to personalize your
              experience. This may include:
            </span>
            <ul className={"list-disc pl-5 pb-2 font-thin"}>
              <li>Sending you safety alerts or notifications.</li>
              <li>
                Tracking your location to help you stay safe. But keep in mind
                that there is no location history, as only one point is being
                used to track your location
              </li>
            </ul>
          </div>
          <div>
            <h2 className={"pb-2 pt-3 text-xl font-bold text-sky-800"}>
              Data Security
            </h2>
            <span>
              We take steps to protect your personal information from
              unauthorized access, use, or disclosure. This includes using
              encryption to secure data in transit and at rest.
              <br />
              However, it is important to note that no security measures are
              perfect, and we cannot guarantee the absolute security of your
              personal information.
            </span>

            <h3 className={"pb-2 pt-3 text-lg font-bold text-sky-800"}>
              Your Choices and Controls
            </h3>
            <span>
              You have the following choices and controls regarding your
              personal information:
            </span>

            <ul className={"list-disc pl-5 pb-2 font-thin"}>
              <li>
                You can choose not to provide certain information to us, but
                this may limit your ability to use certain features of our app.
              </li>
              <li>
                You can update or correct your some personal information at any
                time by accessing your account settings within the app.
              </li>
              {/*<li>*/}
              {/*  You can delete your account by accessing your account settings*/}
              {/*  within the app.*/}
              {/*</li>*/}
              <li>
                You can turn off location tracking using your browser or devices
                settings.
              </li>
            </ul>
          </div>
          <div>
            <h2 className={"pb-2 pt-3 text-xl font-bold text-sky-800"}>
              Changes to This Policy
            </h2>
            <p className={"font-thin"}>
              We may change this privacy policy from time to time. We will post
              any changes on this page and encourage you to review the policy
              periodically. If we make any significant changes to the policy, we
              will provide additional notice as appropriate, such as by email or
              in-app notification.
            </p>
            <h2 className={"pb-2 pt-3 text-xl font-bold text-sky-800"}>
              Contact Us
            </h2>
            <p className={"font-thin"}>
              If you have any questions or concerns about our privacy policy or
              the way we handle your personal information, please contact us at{" "}
              <Link href={"mailto:support-danger-radar@mauroner.eu"}>
                support-danger-radar@mauroner.eu
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
    </>
  );
};
export default PrivacyPolicy;
