import CompanySidebar from "@/components/layout/CompanySidebar";
import Header3 from "@/components/layout/Header3";
import MobileMenu from "@/components/layout/MobileMenuCompany";
import React from "react";

export default function layout({ children }) {
  return (
    <>
      <div className="dashboard show dashboard-height-set">
        <Header3 />
        <CompanySidebar />
        {children}
        <MobileMenu />
      </div>
    </>
  );
}
