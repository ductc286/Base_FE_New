import { useRouter } from "next/router";
import React, { useEffect } from "react";

const Logout = () => {
  const router = useRouter();
  useEffect(() => {
    // localStorage.setItem('tokenInfo', null);
    // localStorage.setItem('authorizeInfo', null);
    localStorage.clear();
    router.push("/login");
  }, []);
  return <></>;
};

export default Logout;
