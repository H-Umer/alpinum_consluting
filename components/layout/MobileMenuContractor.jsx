"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { closeMobileMenu } from "@/utils/toggleMobilemenu";
import MobileMenuContractorCategories from "@/components/layout/MobileMenuContractorCategories";
import { usePathname } from "next/navigation";

export default function MobileMenu() {
  const pathname = usePathname();

  useEffect(() => {
    closeMobileMenu();
  }, [pathname]);

  return (
    <div className="menu-mobile-popup ">
      <div className="modal-menu__backdrop" onClick={closeMobileMenu} />
      <div className="widget-filter">
        <div className="mobile-header">
          <div id="logo" className="logo">
            <Link href={`/`}>
              <Image alt="Image" width={120} height={120} src="/images/logo/old-logo.png" />
            </Link>
          </div>
          <a className="title-button-group" onClick={closeMobileMenu}>
            <i className="icon-close" />
          </a>
        </div>
        <div className="tf-tab">
          <div className="content-tab">
            <MobileMenuContractorCategories />
          </div>
        </div>
      </div>
    </div>
  );
}
