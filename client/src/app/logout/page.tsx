"use client";

import { useEffect } from "react";
import useAuth from "../hooks/useAuth";

const page = () => {
  const { logout } = useAuth();
  useEffect(() => {
    logout();
  }, []);

  return <div>this is the logout page</div>;
};

export default page;
