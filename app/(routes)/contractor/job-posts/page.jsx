import React from "react";
import PublicJobPosts from "@/components/contractor/PublicJobPosts";

export const metadata = {
  title: "Job Posts - Alpinum Consulting",
  description: "Job Posts",
};

const Page = () => {
  return (
    <>
      <PublicJobPosts />
    </>
  );
};

export default Page;
