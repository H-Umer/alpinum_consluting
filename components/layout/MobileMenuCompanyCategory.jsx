"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const categories = [
  {
    id: 1,
    iconClass: "icon-dashboard",
    title: "Dashboard",
    url: "/company/dashboard",
    subMenu: [],
  },
  {
    id: 2,
    iconClass: "icon-profile",
    title: "Profile",
    url: "#",
    subMenu: [
      { title: "Profile Overview", url: "/company/overview" },
      { title: "Edit Profile", url: "/company/edit-profile" },
    ],
  },
  {
    id: 3,
    iconClass: "icon-following",
    title: "Job Posts",
    url: "/company/job-posts",
    subMenu: [],
  },
  {
    id: 4,
    iconClass: "icon-meeting",
    title: "Contractors",
    url: "/company/find-contractors",
    subMenu: [],
  },
  {
    id: 5,
    iconClass: "icon-work",
    title: "Contracts",
    url: "/company/job-contracts",
    subMenu: [],
  },
];

export default function MobileMenuCompanyCategory() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const menus = document.querySelectorAll(".sub-categorie-mobile .categories-mobile");

    menus.forEach((menu, index) => {
      if (index === openIndex) {
        menu.classList.add("current-item");
        menu.querySelector(".group-menu-category-mobile").style.height = `${
          menu.querySelector(".group-menu-category-mobile").scrollHeight
        }px`;
      } else {
        menu.classList.remove("current-item");
        menu.querySelector(".group-menu-category-mobile").style.height = "0";
      }
    });
  }, [openIndex]);

  return (
    <div className="categories">
      <div className="sub-categorie-mobile">
        <ul className="pop-up mt-2">
          {categories.map((category, i) => (
            <li key={i} className="categories-mobile">
              {category.subMenu.length > 0 ? (
                <a href="#" onClick={() => handleClick(i)}>
                  <span className={category.iconClass} />
                  {category.title}
                </a>
              ) : (
                <Link href={category.url}>
                  <span className={category.iconClass} />
                  {category.title}
                </Link>
              )}
              <div className="group-menu-category-mobile">
                <div className="menu left">
                  <ul>
                    {category.subMenu.map((item, index) => (
                      <li key={index}>
                        <Link href={item.url}>{item.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
