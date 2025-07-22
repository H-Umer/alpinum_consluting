import React from "react";
import JobPosts from "@/components/company/JobPosts";

export const metadata = {
  title: "Job Posts - Alpinum Consulting",
  description: "Alpinum Consulting",
};

const Page = () => {
  return (
    <>
      <JobPosts />
    </>
  );
};

export default Page;
