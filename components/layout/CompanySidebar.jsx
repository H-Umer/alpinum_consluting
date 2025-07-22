"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

const menuItems = [
  { href: "/company/dashboard", icon: "icon-dashboard", title: "Dashboard" },
  {
    title: "Profile",
    icon: "icon-profile",
    hasSubmenu: true,
    submenu: [
      { href: "/company/overview", title: "Profile Overview" },
      { href: "/company/edit-profile", title: "Edit Profile" },
    ],
  },
  {
    href: "/company/job-posts",
    icon: "icon-following",
    title: "Job Posts",
  },
  {
    href: "/company/find-contractors",
    icon: "icon-meeting",
    title: "Contractors",
  },

  {
    href: "/company/job-contracts",
    icon: "icon-work",
    title: "Contracts",
  },
  // {
  //   href: "/company/team",
  //   icon: "icon-meeting",
  //   title: "Team",
  // },
];

export default function CompanySidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpenDD, setIsOpenDD] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  return (
    <div className="left-menu">
      {/*- Sidemenu */}
      <div id="sidebar-menu">
        <ul className="downmenu list-unstyled" id="side-menu">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`tf-effect ${
                pathname == item.href ? "ff-active" : ""
              }  
               
              ${isOpenDD && item.hasSubmenu ? "ff-active" : ""}
              `}
              // onClick={() => {
              //   if (item.hasSubmenu) {
              //     setIsOpenDD((pre) => !pre);
              //   }
              // }}
              onClick={() => {
                if (item.hasSubmenu) {
                  setOpenDropdown((prev) =>
                    prev === item.title ? null : item.title
                  );
                }
              }}
            >
              {item.hasSubmenu ? (
                <>
                  <a className="has-arrow tf-effect">
                    <span className={`${item.icon} dash-icon`} />
                    <span className="dash-titles">{item.title}</span>
                  </a>
                  {openDropdown === item.title && (
                    <ul className="sub-menu2" aria-expanded="false">
                      {item.submenu.map((sub, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            href={sub.href}
                            className={`tf-effect ${
                              pathname == sub.href ? "active" : ""
                            }`}
                          >
                            {sub.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  className={`tf-effect ${
                    pathname == item.href ? "active" : ""
                  }`}
                >
                  <span className={`${item.icon} dash-icon`} />
                  <span className="dash-titles">{item.title}</span>
                </Link>
              )}
            </li>
          ))}
          {/* <li>
              <a className="tf-effect " onClick={handleSubmit}>
                <span className="icon-log-out dash-icon" />
                <span className="dash-titles">Log out</span>
              </a>
            </li> */}
        </ul>
      </div>
    </div>
  );
}
