"use client";
import { useParams } from "next/navigation";
import React from "react";
import OfferContractDocument from "@/components/company/OfferContractDocument";

const Page = () => {
  const params = useParams();

  return (
    <>
      <OfferContractDocument params={params} />
    </>
  );
};

export default Page;
