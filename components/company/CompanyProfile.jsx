"use client";
import React, { useState, useEffect, use } from "react";
import Loader from "../loader/loader";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { FaGithub } from "react-icons/fa";

export default function CompanyProfileOverview() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const token = useSelector((state) => state.currentUser.token);
  const currentUser = useSelector((state) => state.currentUser.user);

  const fetchCvInfo = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/company/company-profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();

      setUser(result);

      if (!response.ok) {
        toast.error(result.error || "Oops! Something Went Wrong!");
      }
    } catch (err) {
      toast.error(err.error || "Oops! Something Went Wrong!");
      console.error("err", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCvInfo();
    }
  }, [token]);

  return (
    <>
      {isLoading && (
        <div className="dashboard__content">
          <section className="page-title-dashboard">
            <div className="themes-container">
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="title-dashboard">
                    <div className="title-dash flex2">Profile Overview</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="flat-dashboard-user flat-dashboard-profile">
            <div className="themes-container">
              <div className="flex59">
                <Loader />
              </div>
            </div>
          </section>
        </div>
      )}
      {!isLoading && (
        <div className="dashboard__content">
          <section className="page-title-dashboard">
            <div className="themes-container">
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="title-dashboard">
                    <div className="title-dash flex2">Profile Overview</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="flat-dashboard-user flat-dashboard-profile">
            {user?.companyProfile ? (
              <div className="themes-container">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="wrap-profile flex2 bg-white">
                      <div className="box-profile flex2">
                        <div className="images">
                          <img
                            alt="Profile Picture"
                            style={{
                              objectFit: "cover",
                              objectPosition: "center",
                              border: "1px solid #e4e4e4",
                              width: "120px",
                              height: "120px",
                              borderRadius: "5%",
                            }}
                            src={user?.companyProfile?.logoUrl || "/images/profile/placeholder.jpg"}
                          />
                        </div>
                        <div className="content">
                          <div className="check-box flex2">
                            <h3>{user?.companyProfile?.companyName}</h3>
                          </div>
                          <div className="tag-wrap flex">
                            {user?.companyProfile?.location && (
                              <div
                                className="map color-4"
                                style={{
                                  display: "flex",
                                  alignContent: "center",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {user?.companyProfile?.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="tt-button tt-button2">
                        <a href="/company/edit-profile">Edit Profile</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="themes-container">
                <div className="row">
                  <div className="col-lg-12 col-md-12 ">
                    <div className="wrap-profile flex2 bg-white">
                      <div className="flex2">
                        <div className="content">
                          <h5 className="fw-6 color-3">Null</h5>
                          <div className="gap-2 flex2">
                            <h3>{user?.companyProfile?.companyName || ""}</h3>
                          </div>
                        </div>
                      </div>
                      <div className="tt-button flex2 tt-button2">
                        <a href="/contractor/edit-profile">Edit Profile</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
          <section className="flat-dashboard-overview flat-dashboard-about flex60">
            <div className="themes-container">
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  {user?.user && (
                    <div className="wrap-about flex">
                      <div className="side-bar sidebar-company-side">
                        <div className="sidebar-map bg-white">
                          <div className=" flex user-profile row">
                            <div className="p-16 col-md-3">Email</div>
                            <h4 className="col-md-9">
                              {user?.user?.email ? user?.user?.email : ""}
                            </h4>
                          </div>
                          <div className=" flex user-profile row">
                            <div className="p-16 col-md-3">Joining Date</div>
                            <h4 className="col-md-9">
                              {new Date(user?.user?.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </h4>
                          </div>
                          {user?.companyProfile?.website && (
                            <div className="flex user-profile row">
                              <div className="p-16 col-3">Website</div>
                              <h4 className="col-md-9">{user?.companyProfile?.website}</h4>
                            </div>
                          )}

                          {user?.companyProfile?.industry && (
                            <div className=" flex user-profile row">
                              <div className="p-16 col-md-3">Industry</div>
                              <h4 className="col-md-9"> {`${user?.companyProfile?.industry}`}</h4>
                            </div>
                          )}

                          {user?.companyProfile?.description && (
                            <div className=" flex user-profile row">
                              <div className="p-16 col-md-3">Description</div>
                              <h4 className="col-md-9">{`${user?.companyProfile?.description}`}</h4>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
