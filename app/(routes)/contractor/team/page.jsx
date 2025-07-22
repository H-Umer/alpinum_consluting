import TeamPage from "@/components/contractor/Team";
import React from "react";
import { ToastContainer } from "react-toastify";

export const metadata = {
  title: "Team - Alpinum Consulting",
  description: "Alpinum Consulting",
};

const Page = () => {
  return (
    <>
      | <ToastContainer position="top-right" autoClose={3000} /> <TeamPage />
    </>
  );
};

export default Page;
