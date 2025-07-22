"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/components/loader/loader";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const jobId = decodeURIComponent(params.id);
  const [jobInfo, setJobInfo] = useState({});
  const [jobApplicants, setJobApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector((state) => state.currentUser.token);

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/company/job-posts/${jobId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      setJobInfo(result.data);
      setJobApplicants(result.data.jobApplication);

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

  const handlecheckProfile = (id) => {
    try {
      setIsLoading(true);
      router.push(`/company/contractor-profile/${id}`);
    } catch (error) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadDoc = async (docUrl) => {
    try {
      setIsLoading(true);
      const response = await fetch(docUrl);
      if (!response.ok) {
        toast.error("Failed to download document!");
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
      toast.error("Download Failed!");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppointment = (id) => {
    try {
      setIsLoading(true);
      if (id !== undefined && id !== null) {
        router.push(`/company/find-contractors/${id}`);
      }
    } catch (err) {
      toast.error(err.message || "Oops! Something Went Wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOffers = (id) => {
    try {
      setIsLoading(true);
      router.push(`/company/offers/${id}`);
    } catch (err) {
      toast.error(err.message || "Oops! Something Went Wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="dashboard__content">
        <section className="page-title-dashboard">
          <div className="themes-container">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="title-dashboard">
                  <div className="title-dash flex2">Job Details</div>
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

        {!isLoading && jobInfo && (
          <section className="flat-dashboard-resumes flat-dashboard-setting">
            <div className="themes-container_main">
              <div className="tf-tab">
                <div className="row">
                  <div className="col-lg-12 col-md-12 ">
                    <div className="profile-setting bg-white">
                      <div className="job-details-container">
                        <div className="job-details-content">
                          <div className="job-role">{jobInfo.role}</div>

                          <div className="job-meta-info">
                            <table className="job-meta-table">
                              <tbody>
                                <tr>
                                  <td className="meta-label">Location</td>
                                  <td className="meta-value">{jobInfo.location}</td>
                                </tr>
                                <tr>
                                  <td className="meta-label">Job Type</td>
                                  <td className="meta-value">
                                    {jobInfo.jobType === "FULL_TIME"
                                      ? "Full Time"
                                      : jobInfo.jobType === "PART_TIME"
                                      ? "Part Time"
                                      : jobInfo.jobType === "CONTRACT"
                                      ? "Contract"
                                      : jobInfo.jobType === "FREELANCE"
                                      ? "Freelance"
                                      : jobInfo.jobType}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="meta-label">Experience Required</td>
                                  <td className="meta-value">{jobInfo.experience} Years</td>
                                </tr>
                                <tr>
                                  <td className="meta-label">Rate</td>
                                  <td className="meta-value">
                                    {jobInfo.currency} {jobInfo.rate}/hour
                                  </td>
                                </tr>
                                <tr>
                                  <td className="meta-label">Availability</td>
                                  <td className="meta-value">
                                    {jobInfo.availability
                                      ? new Date(jobInfo.availability).toLocaleDateString()
                                      : ""}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <div className="job-details-section">
                            <h3
                              style={{
                                color: "#000",
                                fontSize: "1.2rem",
                                fontWeight: "700",
                              }}
                            >
                              Description:
                            </h3>
                            <div
                              className="desc-html"
                              dangerouslySetInnerHTML={{
                                __html: jobInfo.description,
                              }}
                            />
                          </div>
                          <div className="job-details-section">
                            <h3
                              style={{
                                color: "#000",
                                fontSize: "1.2rem",
                                fontWeight: "700",
                              }}
                            >
                              Additional Requirements:
                            </h3>
                            <div
                              className="desc-html"
                              dangerouslySetInnerHTML={{
                                __html: jobInfo.additionalRequirements,
                              }}
                            />
                          </div>
                          <div className="job-details-section">
                            <h3
                              style={{
                                color: "#000",
                                fontSize: "1.2rem",
                                fontWeight: "700",
                              }}
                            >
                              Required Skills:
                            </h3>
                            <div className="job-details-skills">
                              {jobInfo.skills?.map((skill, idx) => (
                                <span className="job-details-skill" key={idx}>
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h3
                      style={{
                        marginTop: "20px",
                        marginBottom: "20px",
                        gap: "0.5rem",
                        fontSize: "25px",
                        paddingLeft: "8px",
                        fontWeight: "600",
                      }}
                    >
                      Job Applicants
                    </h3>
                    <div className="profile-setting bg-white" style={{ marginBottom: "20px" }}>
                      <div>
                        {jobApplicants.length > 0 ? (
                          jobApplicants.map((contract, i) => (
                            <div key={i} className="employer-block style-2 cl2">
                              <div
                                className="inner-box"
                                style={{
                                  display: "flex",
                                  gap: "10px",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "10px",
                                  }}
                                >
                                  <img
                                    alt="Profile Picture"
                                    style={{
                                      objectFit: "cover",
                                      objectPosition: "center",
                                      width: "120px",
                                      border: "1px solid #e4e4e4",
                                      height: "120px",
                                      borderRadius: "5%",
                                    }}
                                    src={
                                      contract?.contractor?.contractorProfile?.imageUrl ||
                                      "/images/profile/placeholder.jpg"
                                    }
                                  />
                                  <div
                                    className="box-content"
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      justifyContent: "center",
                                      alignItems: "flex-start",
                                    }}
                                  >
                                    <h3
                                      style={{
                                        fontSize: "20px",
                                        fontWeight: "bold",
                                        color: "#111827",
                                        marginBottom: "12px",
                                        margin: 0,
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        gap: "0.5rem",
                                        paddingLeft: "7px",
                                      }}
                                    >
                                      {contract?.contractor?.firstName}{" "}
                                      {contract?.contractor?.lastName}
                                    </h3>

                                    {contract?.contractor?.contractorProfile?.designation && (
                                      <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                                        <span>
                                          {contract?.contractor?.contractorProfile?.designation}
                                        </span>
                                      </div>
                                    )}

                                    <p
                                      className="info company-hover"
                                      onClick={() => handlecheckProfile(contract?.contractor?.id)}
                                    >
                                      <span
                                        style={{
                                          color: "#f47920",
                                          fontSize: "16px",
                                          gap: "0.5rem",
                                          paddingLeft: "8px",
                                          fontWeight: "600",
                                        }}
                                      >
                                        View Profile
                                      </span>
                                    </p>
                                  </div>
                                </div>

                                <div className="action-wrap">
                                  <div className="relative text-left">
                                    <details className="dropdown">
                                      <summary className="button-cancel-1 fw-7 cursor-pointer px-2 py-2 rounded bg-gray-200 hover:bg-gray-300">
                                        Actions
                                      </summary>
                                      <ul className="mt-1 bg-white border border-gray-300 rounded shadow-lg z-10 min-w-[130px]">
                                        {contract?.contractor?.contractorResume && (
                                          <li>
                                            <div
                                              onClick={() =>
                                                handleDownloadDoc(
                                                  contract?.contractor.contractorResume[0].fileUrl
                                                )
                                              }
                                              className="block w-[130px] text-left px-1 py-1 hover:bg-gray-100"
                                            >
                                              Download CV
                                            </div>
                                          </li>
                                        )}

                                        {contract?.contractor?.contractorProfile?.startTime &&
                                          contract?.contractor?.contractorProfile?.endTime &&
                                          contract?.contractor?.contractorProfile?.availabilityDays
                                            ?.length > 0 && (
                                            <>
                                              <li>
                                                <div
                                                  onClick={() =>
                                                    handleAppointment(
                                                      contract?.contractor?.contractorProfile.id
                                                    )
                                                  }
                                                  className="block w-[130px] text-left px-1 py-1 hover:bg-gray-100"
                                                >
                                                  Schedule Meeting
                                                </div>
                                              </li>
                                              <li>
                                                <div
                                                  onClick={() =>
                                                    handleOffers(
                                                      contract?.contractor?.contractorProfile.id
                                                    )
                                                  }
                                                  className="block w-[130px] text-left px-1 py-1 hover:bg-gray-100"
                                                >
                                                  Offer Contract
                                                </div>
                                              </li>
                                            </>
                                          )}
                                      </ul>
                                    </details>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center">
                            <p>No applicants found for this job!</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default Page;
