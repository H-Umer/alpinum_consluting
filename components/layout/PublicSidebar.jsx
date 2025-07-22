"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

const menuItems = [
  { href: "/public/dashboard", icon: "icon-dashboard", title: "Dashboard" },
  {
    href: "/public/talent-pool",
    icon: "icon-meeting",
    title: "Talent Pool",
  },
  //   {
  //     title: "Profile",
  //     icon: "icon-profile",
  //     hasSubmenu: true,
  //     submenu: [
  //       { href: "/contractor/profile-overview", title: "Profile Overview" },
  //       { href: "/contractor/edit-profile", title: "Edit Profile" },
  //     ],
  //   },
  //   {
  //     href: "/contractor/training",
  //     icon: "icon-my-apply",
  //     title: "Training",
  //   },
  //   { href: "/contractor/offers", icon: "icon-bell1", title: "Offers" },
  //   {
  //     href: "/contractor/job-posts",
  //     icon: "icon-following",
  //     title: "Job Posts",
  //   },
  // { href: "/contractor/interviews", icon: "icon-meeting", title: "Interviews" },
  // { href: "/candidates-save-jobs", icon: "icon-work", title: "Saved Jobs" },
  // { href: "/candidates-messages", icon: "icon-chat", title: "Messages" },
  // {
  //   href: "/candidates-following-employers",
  //   icon: "icon-following",
  //   title: "Following Employers",
  // },
  //
  // {
  //   href: "/contractor/change-passwords",
  //   icon: "icon-change-passwords",
  //   title: "Change passwords",
  // },
  // {
  //   href: "/candidates-delete-profile",
  //   icon: "icon-trash",
  //   title: "Delete Profile",
  // },
];
export default function PublicSidebar() {
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
