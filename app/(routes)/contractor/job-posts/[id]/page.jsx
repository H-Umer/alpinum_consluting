"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/components/loader/loader";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Page = () => {
  const params = useParams();
  const jobId = decodeURIComponent(params.id);
  const [jobInfo, setJobInfo] = useState({});
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
      {isLoading && <Loader />}

      {!isLoading && jobInfo && (
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
                              dangerouslySetInnerHTML={{ __html: jobInfo.description }}
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
                              dangerouslySetInnerHTML={{ __html: jobInfo.additionalRequirements }}
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
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default Page;
