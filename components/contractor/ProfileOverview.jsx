"use client";
import React, { useState, useEffect } from "react";
import Loader from "../loader/loader";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { FaGithub } from "react-icons/fa";
import { formatTimeWithZone } from "@/utils/formatTimeWithZone";

export default function ProfileOverview() {
  const [cvInfo, setCVInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(false);
  const token = useSelector((state) => state.currentUser.token);
  const currentUser = useSelector((state) => state.currentUser.user);

  const fetchCvInfo = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/contractor-profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      setUser(result.user);

      if (!response.ok) {
        toast.error(result.message || "Oops! Something Went Wrong!");
      }
      setCVInfo(result);
    } catch (err) {
      toast.error(err.message || "Oops! Something Went Wrong!");
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
            {cvInfo?.CV ? (
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
                            src={cvInfo?.CV?.imageUrl || "/images/profile/placeholder.jpg"}
                          />
                        </div>
                        <div className="content">
                          <h5 className="fw-6 color-3">{cvInfo?.CV?.designation}</h5>
                          <div className="check-box flex2">
                            <h3>{`${cvInfo?.user?.firstName} ${cvInfo?.user?.lastName}`}</h3>
                            <svg
                              width={20}
                              height={20}
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10Z"
                                fill="#504CFE"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M10.9099 3.73218C11.052 3.77687 11.1762 3.86573 11.2643 3.98583C11.3524 4.10593 11.3999 4.25102 11.3999 4.39998V7.89998H14.1999C14.328 7.89992 14.4536 7.93499 14.5631 8.00136C14.6726 8.06773 14.7618 8.16286 14.821 8.2764C14.8801 8.38994 14.9071 8.51754 14.8988 8.64532C14.8905 8.77309 14.8473 8.89614 14.7739 9.00108L9.87392 16.0011C9.78864 16.1233 9.6666 16.215 9.52556 16.2631C9.38452 16.3111 9.23183 16.3129 9.08971 16.2681C8.94759 16.2234 8.82345 16.1344 8.73537 16.0143C8.64728 15.8941 8.59983 15.749 8.59992 15.6V12.1H5.79992C5.67188 12.1 5.54627 12.065 5.43677 11.9986C5.32727 11.9322 5.23808 11.8371 5.17889 11.7236C5.1197 11.61 5.09279 11.4824 5.10108 11.3546C5.10937 11.2269 5.15255 11.1038 5.22592 10.9989L10.1259 3.99888C10.2113 3.87693 10.3334 3.78539 10.4744 3.73755C10.6154 3.68972 10.7679 3.68808 10.9099 3.73288V3.73218Z"
                                fill="white"
                              />
                            </svg>
                          </div>
                          <div
                            className="tag-wrap flex"
                            style={{
                              marginTop: "10px",
                            }}
                          >
                            <div className="tag-box flex">
                              {cvInfo?.CV?.languages?.map((el, index) => (
                                <a key={index}>{el}</a>
                              ))}
                            </div>
                            <div
                              className="map color-4"
                              style={{
                                display: "flex",
                                alignContent: "center",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              {cvInfo?.CV?.country}
                            </div>
                            <div
                              className="dolar color-4"
                              style={{
                                display: "flex",
                                alignContent: "center",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              {cvInfo?.CV?.hourlyRate}$/hr
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="tt-button tt-button2">
                        <a href="/contractor/edit-profile">Edit Profile</a>
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
                            src={"/images/profile/placeholder.jpg"}
                          />
                        </div>
                        <div className="content">
                          <h5 className="fw-6 color-3">{cvInfo?.CV?.designation}</h5>
                          <div className="gap-2 flex2">
                            <h3>{`${cvInfo?.user?.firstName || currentUser?.firstName} ${
                              cvInfo?.user?.lastName || currentUser?.lastName
                            }`}</h3>
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
                  {cvInfo?.CV && (
                    <div className="wrap-about flex">
                      <div className="side-bar">
                        <div className="sidebar-map bg-white">
                          <div className="title-box flex">
                            <div className="p-16">Experience</div>
                            <h4>{cvInfo?.CV?.yearsExperience || null} Years</h4>
                          </div>
                          <div className="title-box flex">
                            <div className="p-16">Location</div>
                            <h4>
                              {cvInfo?.CV?.city}
                              {", "} {cvInfo?.CV?.country}
                            </h4>
                          </div>

                          <div className="title-box flex gap-2">
                            <div className="p-16">Tokens</div>
                            <h4>{cvInfo?.user?.connects}</h4>
                          </div>

                          <div className="title-box flex gap-2">
                            <div className="p-16">Availability</div>
                            <h4>
                              {formatTimeWithZone(
                                cvInfo?.CV?.startTime,
                                cvInfo?.CV?.availabilityZone
                              )}
                              —{" "}
                              {formatTimeWithZone(
                                cvInfo?.CV?.endTime,
                                cvInfo?.CV?.availabilityZone
                              )}
                            </h4>
                          </div>

                          {cvInfo?.CV?.userId === user?.id && (
                            <div className="wrap-icon">
                              <div className="box-icon flex">
                                {cvInfo?.CV.socialLink.find(
                                  (link) => link.platform === "twitter" && link.url
                                ) ? (
                                  <a
                                    href={
                                      cvInfo?.CV.socialLink.find(
                                        (link) => link.platform === "twitter"
                                      )?.url
                                    }
                                    className="icon-twitter"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  />
                                ) : null}

                                {cvInfo?.CV.socialLink.find(
                                  (link) => link.platform === "github" && link.url
                                ) ? (
                                  <a
                                    href={
                                      cvInfo?.CV.socialLink.find(
                                        (link) => link.platform === "github"
                                      )?.url
                                    }
                                    className="icon-github2 githubiconStyle"
                                    size={20}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <FaGithub />
                                  </a>
                                ) : null}

                                {cvInfo?.CV.socialLink.find(
                                  (link) => link.platform === "linkedIn" && link.url
                                ) ? (
                                  <a
                                    href={
                                      cvInfo?.CV.socialLink.find(
                                        (link) => link.platform === "linkedIn"
                                      )?.url
                                    }
                                    className="icon-linkedin2"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  />
                                ) : null}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="post-about widget-dash-video bg-white">
                        <div className="timeline-wrap">
                          <div className="timeline-box">
                            <div className="title-box flex2">
                              <div className="inner flex2">
                                <svg
                                  width={18}
                                  height={36}
                                  viewBox="0 0 18 36"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <circle opacity="0.12" cx={9} cy="18.1016" r={9} fill="#37B853" />
                                  <circle cx={9} cy="18.1016" r={6} fill="#37B853" />
                                </svg>
                                <h3 className="titles fw-7">Education </h3>
                              </div>
                            </div>
                            <div className="content">
                              <div className="texts color-4">{cvInfo?.CV?.degreeInfo}</div>
                            </div>
                          </div>
                          {cvInfo?.CV?.languages.length > 0 && (
                            <div className="timeline-box">
                              <div className="title-box flex2">
                                <div className="inner flex2">
                                  <svg
                                    width={18}
                                    height={36}
                                    viewBox="0 0 18 36"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <circle
                                      opacity="0.12"
                                      cx={9}
                                      cy="18.1016"
                                      r={9}
                                      fill="#37B853"
                                    />
                                    <circle cx={9} cy="18.1016" r={6} fill="#37B853" />
                                  </svg>
                                  <h3 className="titles fw-7">Programming Languages </h3>
                                </div>
                              </div>
                              <div className="content">
                                <div className="texts color-4">
                                  {cvInfo?.CV?.languages?.join(", ")}
                                </div>
                              </div>
                            </div>
                          )}

                          {cvInfo?.CV?.tools?.length > 0 && (
                            <div className="timeline-box">
                              <div className="title-box flex2">
                                <div className="inner flex2">
                                  <svg
                                    width={18}
                                    height={36}
                                    viewBox="0 0 18 36"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <circle
                                      opacity="0.12"
                                      cx={9}
                                      cy="18.1016"
                                      r={9}
                                      fill="#37B853"
                                    />
                                    <circle cx={9} cy="18.1016" r={6} fill="#37B853" />
                                  </svg>
                                  <h3 className="titles fw-7">Tools </h3>
                                </div>
                              </div>
                              <div className="content">
                                <div className="texts color-4">{cvInfo?.CV?.tools?.join(", ")}</div>
                              </div>
                            </div>
                          )}

                          {cvInfo?.CV?.methodologies.length > 0 && (
                            <div className="timeline-box">
                              <div className="title-box flex2">
                                <div className="inner flex2">
                                  <svg
                                    width={18}
                                    height={36}
                                    viewBox="0 0 18 36"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <circle
                                      opacity="0.12"
                                      cx={9}
                                      cy="18.1016"
                                      r={9}
                                      fill="#37B853"
                                    />
                                    <circle cx={9} cy="18.1016" r={6} fill="#37B853" />
                                  </svg>
                                  <h3 className="titles fw-7">Methodologies </h3>
                                </div>
                              </div>
                              <div className="content">
                                <div className="texts color-4">
                                  {cvInfo?.CV?.methodologies.join(", ")}
                                </div>
                              </div>
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
