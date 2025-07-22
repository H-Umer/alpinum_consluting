"use client";

import { openMobileMenu } from "@/utils/toggleMobilemenu";

export default function MobileOpen() {
  return (
    <div className="nav-mobile" onClick={() => openMobileMenu()}>
      <span />
    </div>
  );
}
