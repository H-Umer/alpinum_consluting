"use client";
import React, { useState, useEffect } from "react";
import Loader from "../loader/loader";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const Resumes = () => {
  const router = useRouter();
  const [resumes, setResumes] = useState([]);
  const token = useSelector((state) => state.currentUser.token);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCvInfo = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/contractor-resume", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      const sortedResumes = result.user.contractorResume.sort(
        (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)
      );
      setResumes(sortedResumes);
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

  const handleDownloadDoc = async (docUrl) => {
    try {
      const response = await fetch(docUrl);
      if (!response.ok) {
        toast.error("Failed to download document.");
        return;
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = docUrl.split("/").pop() || "document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error("Download failed.");
      console.error(err);
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
    <div className="dashboard__content">
      <section className="page-title-dashboard">
        <div className="themes-container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="title-dashboard">
                <div className="title-dash flex2">Resumes</div>
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
      {!isLoading &&
        (resumes.length > 0 ? (
          <section className="flat-dashboard-resumes flat-dashboard-setting">
            <div className="themes-container_main">
              <div className="tf-tab">
                <div className="row">
                  <div className="col-lg-12 col-md-12 ">
                    <div className="wrap-profile instruction bg-white">
                      <div className="instruction_container  flex2 flex46">
                        <div className="group-title md:col-12 col-lg-9">
                          <h3 className="fw-6 color-3">Resume Management</h3>
                          <p className="mt-2">
                            Manage and organize all your uploaded resumes in one
                            place. Upload new resumes, download existing ones,
                            and keep track of your professional documents. This
                            section helps you maintain an up-to-date portfolio
                            for job applications.
                          </p>
                        </div>
                        <div className="moodlePortal2 md:col-12 col-lg-3">
                          <div className="tt-button1 tt-button tt-button2 moodlePortal ">
                            <a
                              onClick={() =>
                                router.push("/contractor/upload-resume")
                              }
                            >
                              Upload Resume
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="profile-setting bg-white">
                      <div className="content-tab cv-stc2">
                        <div className="inner">
                          <div className="group-col-2">
                            {resumes.map((template, index) => (
                              <div key={index} className="wd-cv-template cl4">
                                <div className="content">
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <div>
                                      <h6>
                                        <a>Resume {index + 1}</a>
                                      </h6>
                                      <span>
                                        Uploaded At:{" "}
                                        {new Date(
                                          template.uploadedAt
                                        ).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <ul className="flex2 gap-2">
                                      <div
                                        style={{
                                          cursor: "pointer",
                                        }}
                                        className="offer-downloadButton"
                                        onClick={() =>
                                          handleDownloadDoc(template.fileUrl)
                                        }
                                      >
                                        <li
                                          className="hv-tool"
                                          data-tooltip="Download CV"
                                        >
                                          <a
                                            style={{ color: "#F47920" }}
                                            className="action-icon icon-download offer-button"
                                          />
                                        </li>
                                      </div>
                                    </ul>
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
          </section>
        ) : (
          <section className="flat-dashboard-resumes flat-dashboard-setting">
            <div className="themes-container_main">
              <div className="tf-tab">
                <div className="row">
                  <div className="col-lg-12 col-md-12 ">
                    <div className="wrap-profile instruction bg-white">
                      <div className="instruction_container  flex2 flex48">
                        <div className="group-title md:col-12 col-lg-10">
                          <h3 className="fw-6 color-3">Resume Section</h3>
                          <p className="mt-2">
                            Review and manage all Resumes Created from your
                            Profile. For Change Resume Upload Resume and
                            maintain a clear overview of your professional
                            opportunities.
                          </p>
                        </div>
                        <div className="action-wrap">
                          <ul className="flex2 gap-2">
                            <div>
                              <li>
                                <a
                                  className="button-cancel-1 fw-7 remove-file"
                                  onClick={() =>
                                    router.push("/contractor/upload-resume")
                                  }
                                >
                                  Upload Resume
                                </a>
                              </li>
                            </div>
                          </ul>
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
                              {" "}
                              <span
                                style={{ color: "#FFA500", fontSize: "1.2em" }}
                              >
                                ⚠️
                              </span>
                              No Offers Found
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
    </div>
  );
};

export default Resumes;
