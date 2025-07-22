"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loader from "../loader/loader";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const CompanyProfile = () => {
  const params = useParams();
  const token = useSelector((state) => state.currentUser.token);
  const [isLoading, setIsloading] = useState(false);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      fetchCompanyProfile();
    }
  }, [token]);

  const fetchCompanyProfile = async () => {
    setIsloading(true);
    try {
      const resp = await fetch(`/api/company/company-profile/${params.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await resp.json();
      setCompanyProfile(result.companyProfile);
      setUser(result.user);
    } catch (error) {
      toast.error(error.error);
    } finally {
      setIsloading(false);
    }
  };

  return (
    <div className="dashboard__content">
      <section className="page-title-dashboard">
        <div className="themes-container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="title-dashboard">
                <div className="title-dash flex2">Company Profile</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {isLoading && (
        <section className="flat-dashboard-resumes flat-dashboard-setting">
          <div className="themes-container_main">
            <div className="flex59">
              <Loader />
            </div>
          </div>
        </section>
      )}
      {!isLoading && (
        <>
          <section className="flat-dashboard-user flat-dashboard-profile">
            {companyProfile ? (
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
                            src={companyProfile?.logoUrl || "/images/profile/placeholder.jpg"}
                          />
                        </div>
                        <div className="content">
                          <div className="check-box flex2">
                            <h3>{companyProfile?.companyName}</h3>
                          </div>
                          <div className="tag-wrap flex">
                            {companyProfile?.location && (
                              <div
                                className="map color-4"
                                style={{
                                  display: "flex",
                                  alignContent: "center",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {companyProfile?.location}
                              </div>
                            )}
                          </div>
                        </div>
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
                            <h3>{companyProfile?.companyName || ""}</h3>
                          </div>
                        </div>
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
                  {companyProfile && (
                    <div className="wrap-about flex">
                      <div className="side-bar sidebar-company-side">
                        <div className="sidebar-map bg-white">
                          <div className=" flex user-profile row">
                            <div className="p-16 col-md-3">Email</div>
                            <h4 className="col-md-9">{companyProfile ? user?.email : ""}</h4>
                          </div>
                          <div className=" flex user-profile row">
                            <div className="p-16 col-md-3">Joining Date</div>
                            <h4 className="col-md-9">
                              {new Date(companyProfile?.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </h4>
                          </div>
                          {companyProfile?.companySize && (
                            <div className="flex user-profile row">
                              <div className="p-16 col-3">Company Size</div>
                              <h4 className="col-md-9">{companyProfile?.companySize}</h4>
                            </div>
                          )}

                          {companyProfile?.foundedYear && (
                            <div className="flex user-profile row">
                              <div className="p-16 col-3">Founded Year</div>
                              <h4 className="col-md-9">{companyProfile?.foundedYear}</h4>
                            </div>
                          )}

                          {companyProfile?.website && (
                            <div className="flex user-profile row">
                              <div className="p-16 col-3">Website</div>
                              <h4 className="col-md-9">{companyProfile?.website}</h4>
                            </div>
                          )}

                          {companyProfile?.industry && (
                            <div className=" flex user-profile row">
                              <div className="p-16 col-md-3">Industry</div>
                              <h4 className="col-md-9"> {`${companyProfile?.industry}`}</h4>
                            </div>
                          )}

                          {companyProfile?.description && (
                            <div className=" flex user-profile row">
                              <div className="p-16 col-md-3">Description</div>
                              <h4 className="col-md-9">{`${companyProfile?.description}`}</h4>
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
        </>
      )}
    </div>
  );
};

export default CompanyProfile;
