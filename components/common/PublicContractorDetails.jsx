"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/components/loader/loader";
import { toast } from "react-toastify";

const PublicContractorDetails = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const contractorId = params.id;
  const [isLoading, setIsLoading] = useState(false);
  const [cvInfo, setCVInfo] = useState([]);
  const resumeProfile = searchParams.get("resumeProfile");

  useEffect(() => {
    fetchTalentPool();
  }, [contractorId]);

  const fetchTalentPool = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/public-resumes/${contractorId}?resumeProfile=${resumeProfile}`
      );
      const result = await response.json();
      setCVInfo(result);

      if (!response.ok) {
        toast.error(result.message || "Oops! Something Went Wrong!");
      }
    } catch (err) {
      toast.error(err.message || "Oops! Something Went Wrong!");
      console.error("err", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <>
          <section className="page-title-dashboard page-title-dashboard-public themes-container-public-header">
            <div className="themes-container">
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="title-dashboard">
                    <div className="title-dash flex2">Contractor Profile</div>
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
        </>
      )}
      {!isLoading && (
        <>
          <section className="page-title-dashboard page-title-dashboard-details themes-container-public-header">
            <div className="themes-container themes-container-public">
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="title-dashboard">
                    <div className="title-dash flex2">Contractor Profile</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {cvInfo?.user?.role === "CONTRACTOR" ? (
            <>
              <section className="flat-dashboard-user flat-dashboard-profile">
                {cvInfo?.CV ? (
                  <div className="themes-container themes-container-public">
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
                                src={
                                  cvInfo?.CV?.imageUrl
                                    ? cvInfo?.CV?.imageUrl
                                    : "/images/profile/placeholder.jpg"
                                }
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
                              <div className="tag-wrap flex">
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
                              <h5 className="fw-6 color-3">{cvInfo?.CV?.designation}</h5>
                              <div className="gap-2 flex2">
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
                <div className="themes-container themes-container-public">
                  <div className="row">
                    <div className="col-lg-12 col-md-12">
                      {cvInfo?.CV && (
                        <div className="wrap-about flex">
                          <div className="side-bar">
                            <div className="sidebar-map bg-white">
                              <div className="title-box flex">
                                <div className="p-16">Experience</div>
                                <h4>{cvInfo?.CV?.yearsExperience} Years</h4>
                              </div>
                              <div className="title-box flex">
                                <div className="p-16">Location</div>
                                <h4>
                                  {cvInfo?.CV?.city}
                                  {", "} {cvInfo?.CV?.country}
                                </h4>
                              </div>
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
                                      <circle
                                        opacity="0.12"
                                        cx={9}
                                        cy="18.1016"
                                        r={9}
                                        fill="#37B853"
                                      />
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
                                    <div className="texts color-4">
                                      {cvInfo?.CV?.tools?.join(", ")}
                                    </div>
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
            </>
          ) : (
            // ---- Public profiles
            <>
              <section className="flat-dashboard-user flat-dashboard-profile">
                {cvInfo?.resume && (
                  <div className="themes-container themes-container-public-2">
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
                                src={
                                  cvInfo?.resume?.imageUrl
                                    ? cvInfo?.resume?.imageUrl
                                    : "/images/profile/placeholder.jpg"
                                }
                              />
                            </div>
                            <div className="content">
                              <h5 className="fw-6 color-3">
                                {cvInfo?.resume?.designation || null}
                              </h5>
                              <div className="check-box flex2">
                                <h3>{`${cvInfo?.resume?.code || null} `}</h3>
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
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>
              <section className="flat-dashboard-overview flat-dashboard-about flex60">
                <div className="themes-container themes-container-public-2">
                  <div className="row">
                    <div className="col-lg-12 col-md-12">
                      {cvInfo?.resume && (
                        <div className="wrap-about flex">
                          <div className="post-about widget-dash-video bg-white post-about-code">
                            {cvInfo?.resume?.objective ? (
                              <>
                                <h3 className="titles fw-7">Objective </h3>
                                <div className="content">
                                  <div className="texts color-4">{cvInfo?.resume?.objective}</div>
                                </div>
                              </>
                            ) : null}
                            {/* </div> */}
                            <div className="timeline-wrap">
                              {cvInfo?.resume?.summary ? (
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
                                      <h3 className="titles fw-7">Summary </h3>
                                    </div>
                                  </div>
                                  <div className="content">
                                    <div className="texts color-4">
                                      {cvInfo?.resume?.summary.map((el, idx) => (
                                        <div key={idx}>{el}</div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ) : null}

                              {cvInfo?.resume?.education ? (
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
                                      <h3 className="titles fw-7">Education </h3>
                                    </div>
                                  </div>
                                  <div className="content">
                                    <div className="texts color-4">
                                      {cvInfo?.resume?.education?.map((el, idx) => (
                                        <div key={idx}>{el}</div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ) : null}
                              {cvInfo?.resume?.skills?.length > 0 ? (
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
                                      <h3 className="titles fw-7">Skills </h3>
                                    </div>
                                  </div>
                                  <div className="content">
                                    <div className="texts color-4">
                                      {cvInfo?.resume?.skills?.join(", ")}
                                    </div>
                                  </div>
                                </div>
                              ) : null}

                              {cvInfo?.resume?.techniques?.length > 0 ? (
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
                                      <h3 className="titles fw-7">Techniques </h3>
                                    </div>
                                  </div>
                                  <div className="content">
                                    <div className="texts color-4">
                                      {cvInfo?.resume?.techniques?.join(", ")}
                                    </div>
                                  </div>
                                </div>
                              ) : null}

                              {cvInfo?.resume?.tools?.length > 0 ? (
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
                                    <div className="texts color-4">
                                      {cvInfo?.resume?.tools?.join(", ")}
                                    </div>
                                  </div>
                                </div>
                              ) : null}

                              {cvInfo?.resume?.experience ? (
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
                                      <h3 className="titles fw-7">Experience </h3>
                                    </div>
                                  </div>
                                  <div className="content">
                                    <div className="texts color-4">
                                      {cvInfo?.resume?.experience} years
                                    </div>
                                  </div>
                                </div>
                              ) : null}
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
        </>
      )}
    </>
  );
};

export default PublicContractorDetails;
