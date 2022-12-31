import Head from "next/head";

const LoadingComponent = ({ title }: { title: string }) => {
  return (<>
    <Head>
      <title>{title}</title>
    </Head>
    <div className={"relative h-screen dark:bg-gray-900 dark:text-white"}>Loading...</div>
  </>);
};
export default LoadingComponent;