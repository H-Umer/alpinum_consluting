"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loader from "../loader/loader";

const JobPosts = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [jobPosts, setJobPosts] = useState([]);
  const token = useSelector((state) => state.currentUser.token);

  useEffect(() => {
    fetchJobPosts();
  }, []);

  const fetchJobPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/company/job-posts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        setJobPosts(result.data);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error fetching job posts:", error);
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="dashboard__content">
      <section className="page-title-dashboard">
        <div className="themes-container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="title-dashboard">
                <div className="title-dash flex2">All Job Posts</div>
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
                      <div className="group-title md:col-12 col-lg-9">
                        <h3 className="fw-6 color-3">Job Post Management</h3>
                        <p className="mt-2">
                          Create and manage your company's job postings here.
                          You can create new job posts with detailed
                          requirements & experience levels. View all your job
                          posts and manage the hiring process efficiently.
                        </p>
                      </div>

                      <div className="moodlePortal2 md:col-12 col-lg-3">
                        <div className="tt-button1 tt-button tt-button2">
                          <a href="/company/create-job-post">Create Job Post</a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="profile-setting bg-white">
                    <div className="wrap-testimonials over-flow-hidden tf-tab">
                      <div className="tf-container">
                        <div className="content-tab">
                          <div className="inner grid-layout-container">
                            <div className="group-col-2">
                              {jobPosts.map((job, i) => (
                                <div
                                  key={i}
                                  className="features-job features-job2 cl2"
                                >
                                  <div className="col-md-9">
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
                                              job.company.companyProfile
                                                .logoUrl ||
                                              "/images/profile/placeholder.jpg"
                                            }
                                          />
                                        </div>
                                        <div className="box-content">
                                          <h4>
                                            <Link
                                              href={`/company/job-posts/${job.id}`}
                                            >
                                              {
                                                job.company.companyProfile
                                                  .companyName
                                              }
                                            </Link>
                                          </h4>
                                          <h3>
                                            <Link
                                              href={`/company/job-posts/${job.id}`}
                                            >
                                              {job.role}
                                            </Link>
                                          </h3>
                                          <ul>
                                            <li>
                                              <span className="dolar color-4" />{" "}
                                              {job.rate} {job.currency}/hr
                                            </li>
                                            <li>
                                              <span className="icon-calendar" />{" "}
                                              {formatDate(job.createdAt)}
                                            </li>
                                          </ul>
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
                                    <div className="action-wrap">
                                      <a
                                        className="button-cancel-1 fw-7 remove-file"
                                        style={{
                                          width: "130px",
                                          textAlign: "center",
                                        }}
                                        onClick={() =>
                                          router.push(
                                            `/company/job-posts/${job.id}`
                                          )
                                        }
                                      >
                                        View Details
                                      </a>
                                    </div>
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
                      <div className="group-title md:col-12 col-lg-9">
                        <h3 className="fw-6 color-3">Job Post Management</h3>
                        <p className="mt-2">
                          Create and manage your company's job postings here.
                          You can create new job posts with detailed
                          requirements & experience levels. View all your job
                          posts and manage the hiring process efficiently.
                        </p>
                      </div>

                      <div className="moodlePortal2 md:col-12 col-lg-3">
                        <div className="tt-button1 tt-button tt-button2">
                          <a href="/company/create-job-post">Create Job Post</a>
                        </div>
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
                            <span
                              style={{ color: "#FFA500", fontSize: "1.2em" }}
                            >
                              ⚠️
                            </span>
                            No Job Posts Found
                          </h3>
                          <p style={{ textAlign: "center" }}>
                            You have not created any job posts yet. Please
                            create a job post to get started.
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

export default JobPosts;
