"use client";

import { useEffect, useState } from "react";
import Loader from "../loader/loader";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Link from "next/link";

const PublicJobPosts = () => {
  const token = useSelector((state) => state.currentUser.token);
  const user = useSelector((state) => state.currentUser.user);
  const [isLoading, setIsloading] = useState(false);
  const [jobPosts, setJobPosts] = useState([]);

  useEffect(() => {
    if (token) {
      getJobPosts();
    }
  }, [token]);

  const getJobPosts = async () => {
    setIsloading(true);
    try {
      const resp = await fetch("/api/job-posts", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await resp.json();
      if (!resp.ok) {
        toast.error(result.error);
      }

      setJobPosts(result.data);
    } catch (error) {
      toast.error(error.error);
    } finally {
      setIsloading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleJobApply = async (jobID) => {
    setIsloading(true);
    try {
      const resp = await fetch("/api/apply-jobs", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobID: jobID,
        }),
      });
      const result = await resp.json();
      if (!resp.ok) {
        toast.error(result.error);
      }
      getJobPosts();
      toast.success(result.status);
    } catch (error) {
      toast.error(error.error);
    } finally {
      setIsloading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "status-pending";
      case "APPLIED":
        return "status-accepted";
      case "REJECTED":
        return "status-rejected";
      case "SIGNED":
        return "status-signed";
      default:
        return "";
    }
  };

  return (
    <div className="dashboard__content">
      <section className="page-title-dashboard">
        <div className="themes-container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="title-dashboard">
                <div className="title-dash flex2">Explore Job Posts</div>
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

      {!isLoading && jobPosts?.length > 0 && (
        <section className="flat-dashboard-resumes flat-dashboard-setting">
          <div className="themes-container_main">
            <div className="tf-tab">
              <div className="row">
                <div className="col-lg-12 col-md-12 ">
                  <div className="wrap-profile instruction bg-white">
                    <div className="instruction_container  flex2 flex46">
                      <div className="group-title md:col-12 col-lg-12">
                        <h3 className="fw-6 color-3">Getting Started</h3>
                        <p className="mt-2">
                          Explore exciting job opportunities from leading companies. Browse through
                          detailed job posts, review requirements, and apply to positions that match
                          your skills and experience.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="profile-setting bg-white">
                    <div className="wrap-testimonials over-flow-hidden tf-tab">
                      <div className="tf-container">
                        <div className="tf-title style-2">
                          <div className="group-title">
                            <h2>Available Job Posts</h2>
                          </div>
                        </div>

                        <div className="content-tab">
                          <div className="inner grid-layout-container">
                            <div className="group-col-2">
                              {jobPosts.map((job, i) => (
                                <div key={i} className="features-job features-job2  cl2">
                                  <div className="col-md-10">
                                    <div className="job-archive-header">
                                      <div className="inner-box">
                                        <div className="image-shrink">
                                          <img
                                            alt="Company Logo"
                                            style={{
                                              objectFit: "cover",
                                              objectPosition: "center",
                                              border: "1px solid #e4e4e4",
                                              width: "120px",
                                              height: "120px",
                                              borderRadius: "5%",
                                              flexShrink: 0,
                                            }}
                                            src={
                                              job.company.companyProfile.logoUrl ||
                                              "/images/profile/placeholder.jpg"
                                            }
                                          />
                                        </div>
                                        <div className="box-content">
                                          <h4>
                                            <Link href={`/contractor/job-posts/${job.id}`}>
                                              {job.company.companyProfile.companyName}
                                            </Link>
                                          </h4>
                                          <h3>
                                            <Link href={`/contractor/job-posts/${job.id}`}>
                                              {job.role}
                                            </Link>
                                          </h3>
                                          <ul>
                                            <li>
                                              <span className="dolar color-4" /> {job.rate}{" "}
                                              {job.currency}/hr
                                            </li>
                                            <li>
                                              <span className="icon-calendar" />{" "}
                                              {formatDate(job.createdAt)}
                                            </li>
                                          </ul>
                                          {/* <span className="icon-edit" /> */}
                                          {/* <div className="job-archive-footer">
                                          <div className="job-footer-left">
                                            <ul className="job-tag">
                                              {job.skills.map((skill, i2) => (
                                                <li key={i2}>
                                                  <a href="#">{skill}</a>
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        </div> */}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="job-archive-footer">
                                      <div className="job-footer-left">
                                        <ul className="job-tag">
                                          {job.skills.map((skill, i2) => (
                                            <li key={i2}>
                                              <a>{skill}</a>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>

                                  <div
                                    className="col-md-2"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    {job.jobApplication.some(
                                      (el) => el.contractorId === user.id
                                    ) ? (
                                      <div className="content">
                                        <div className="action-wrap">
                                          <ul className="flex2 gap-2">
                                            <li>
                                              <div
                                                className={`status-capsule ${getStatusClass(
                                                  job.jobApplication.find(
                                                    (el) => el.contractorId === user.id
                                                  )?.status
                                                )}`}
                                              >
                                                Applied
                                              </div>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="action-wrap">
                                        <a
                                          className="button-cancel-1 fw-7 remove-file"
                                          style={{
                                            width: "130px",
                                            textAlign: "center",
                                          }}
                                          onClick={() => handleJobApply(job.id)}
                                        >
                                          Apply
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {!isLoading && jobPosts?.length === 0 && (
        <section className="flat-dashboard-resumes flat-dashboard-setting">
          <div className="themes-container_main">
            <div className="tf-tab">
              <div className="row">
                <div className="col-lg-12 col-md-12 ">
                  <div className="wrap-profile instruction bg-white">
                    <div className="instruction_container  flex2 flex46">
                      <div className="group-title md:col-12 col-lg-12">
                        <h3 className="fw-6 color-3">Getting Started</h3>
                        <p className="mt-2">
                          Explore exciting job opportunities from leading companies. Browse through
                          detailed job posts, review requirements, and apply to positions that match
                          your skills and experience.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div
                      className="col-lg-12 col-md-12"
                      style={{
                        height: "100vh",
                      }}
                    >
                      <div className="profile-setting bg-white">
                        <div className="form-infor-profile warn-item-center">
                          <h3
                            className=""
                            style={{
                              fontSize: "1.5em",
                              display: "flex",
                              marginBottom: "5px",
                            }}
                          >
                            <span style={{ color: "#FFA500", fontSize: "1.2em" }}>⚠️</span>
                            No Job Posts Found
                          </h3>
                          <p style={{ textAlign: "center" }}>
                            Please check back later or explore other sections of the platform.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default PublicJobPosts;
