import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

import MyGlobalProvider from "@src/AppForders/Components/Layout/MyGlobalProvider";
import Layout from "@src/Cores/Layout/Layout";

import AuthenticationCpn from "../Generals/AuthenticationCpn";

const pageNotLayout = ["/login", "/401/", "/404/", "/logout"];

export default function ControllerLayout({ Component, pageProps }: any) {
  const router = useRouter();
  const [isAuthorize, setIsAuthorize] = useState(false);

  if (pageNotLayout.includes(router.pathname))
    return <Component {...pageProps} />;
  else if (!isAuthorize) {
    return (
      <AuthenticationCpn
        onCheckAuthorizeDone={() => setIsAuthorize(true)}
      ></AuthenticationCpn>
    );
  } else
    return (
      <>
        <Head>
          <title>Hệ thống gia phả</title>
        </Head>
        <MyGlobalProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MyGlobalProvider>
      </>
    );
}
