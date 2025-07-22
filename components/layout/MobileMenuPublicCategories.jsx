"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const categories = [
  {
    id: 1,
    iconClass: "icon-dashboard",
    title: "Dashboard",
    url: "/public/talent-pool",
    subMenu: [],
  },
  {
    id: 2,
    iconClass: "icon-meeting",
    title: "Talent Pool",
    url: "/public/talent-pool",
    subMenu: [],
  },
  //   {
  //     id: 3,
  //     iconClass: "icon-profile",
  //     title: "Profile",
  //     url: "#",
  //     subMenu: [
  //       { title: "Profile Overview", url: "/contractor/profile-overview" },
  //       { title: "Edit Profile", url: "/contractor/edit-profile" },
  //     ],
  //   },
  //   {
  //     id: 4,
  //     iconClass: "icon-my-apply",
  //     title: "Training",
  //     url: "/contractor/training",
  //     subMenu: [],
  //   },
  //   {
  //     id: 5,
  //     iconClass: "icon-bell1",
  //     title: "Offers",
  //     url: "/contractor/offers",
  //     subMenu: [],
  //   },
  //   {
  //     id: 6,
  //     iconClass: "icon-following",
  //     title: "Job Posts",
  //     url: "/contractor/job-posts",
  //     subMenu: [],
  //   },
];

export default function MobileMenuPublicCategories() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const menus = document.querySelectorAll(
      ".sub-categorie-mobile .categories-mobile"
    );

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
