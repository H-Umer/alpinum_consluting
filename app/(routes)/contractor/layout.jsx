import CandidateSidebar from "@/components/layout/CandidateSidebar";
import Header3 from "@/components/layout/Header3";
import MobileMenu from "@/components/layout/MobileMenuContractor";
import React from "react";

export default function layout({ children }) {
  return (
    <>
      <div className="dashboard show">
        <Header3 />
        <CandidateSidebar />
        <MobileMenu />
        {children}
      </div>
    </>
  );
}
