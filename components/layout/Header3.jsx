"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import MobileOpen from "@/components/layout/MobileOpen";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "@/context/slice";
import { useRouter } from "next/navigation";

export default function Header3() {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.currentUser.token);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const resp = await fetch("/api/auth/sign-out", {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await resp.json();

      if (!resp.ok) {
        toast.error(result.error);
      }

      if (resp.status === 200) {
        toast.success(result.message);
        dispatch(setToken(null));
        router.push("/auth");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />{" "}
      <header id="header" className="header header-style2">
        <div className="tf-container">
          <div className="row">
            <div className="col-md-12">
              <div className="sticky-area-wrap">
                <div id="logo" className="logo">
                  <Link href={`/`}>
                    <Image
                      className="site-logo"
                      alt="Image"
                      src="/images/logo/old-logo.png"
                      width={110}
                      height={110}
                    />
                  </Link>
                </div>

                <div className="header-ct-center"></div>
                <div className="header-ct-right">
                  <div className="header-customize-item login">
                    <div className="dropdown">
                      <button
                        className="btn-light dropdown-toggle button-dropdown d-flex align-items-center border-0 bg-transparent border-transparent"
                        type="button"
                        id="dropdownMenuButton"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                            stroke="#121212"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                            stroke="#121212"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>

                      <ul
                        className="dropdown-menu dropdown-menu-end"
                        aria-labelledby="dropdownMenuButton"
                      >
                        <li>
                          <Link className="dropdown-item" href={`/contractor/change-password`}>
                            Change Password
                          </Link>
                        </li>

                        <li>
                          <a className="dropdown-item" onClick={handleSubmit}>
                            Log Out
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="nav-filter">
                  <MobileOpen />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
