"use client";
import { useEffect, useState } from "react";
import Loader from "../loader/loader";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const JobContracts = () => {
  const router = useRouter();
  const token = useSelector((state) => state.currentUser.token);
  const [isLoading, setIsloading] = useState(false);
  const [contracts, setContracts] = useState(null);

  useEffect(() => {
    if (token) {
      getAllCompanyContracts();
    }
  }, [token]);

  const getAllCompanyContracts = async () => {
    setIsloading(true);
    try {
      const resp = await fetch("/api/company/job-contracts", {
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

      setContracts(result.contracts);
    } catch (error) {
      toast.error(error.error);
    } finally {
      setIsloading(false);
    }
  };

  const handlecheckProfile = (id) => {
    try {
      setIsloading(true);
      router.push(`/company/contractor-profile/${id}`);
    } catch (error) {
      toast.error(error);
    } finally {
      setIsloading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "status-pending";
      case "ACCEPTED":
        return "status-accepted";
      case "REJECTED":
        return "status-rejected";
      case "SIGNED":
        return "status-signed";
      default:
        return "";
    }
  };

  const handleDownloadDoc = async (doc) => {
    if (!doc) {
      console.error("No file URL found");
      return;
    }
    try {
      const response = await fetch(doc);
      if (!response.ok) {
        throw new Error("Failed to fetch document");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = doc.split("/").pop() || "document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="dashboard__content">
      <section className="page-title-dashboard">
        <div className="themes-container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="title-dashboard">
                <div className="title-dash flex2">All Contracts</div>
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
        (contracts?.length > 0 ? (
          <section className="flat-dashboard-resumes flat-dashboard-setting">
            <div className="themes-container_main">
              <div className="tf-tab">
                <div className="row">
                  <div className="col-lg-12 col-md-12 ">
                    <div className="wrap-profile instruction bg-white">
                      <div className="instruction_container">
                        <div className="group-title md:col-12 col-lg-12">
                          <h3 className="fw-6 color-3">Contract Management</h3>
                          <p className="mt-2">
                            Manage and track all your contractor agreements in
                            one place. View contract statuses, from pending
                            offers to signed agreements. Monitor your hiring
                            process and maintain a clear overview of all
                            professional relationships.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="profile-setting bg-white">
                      <div>
                        {contracts?.map((contract, i) => (
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
                                    contract?.contractor?.contractorProfile
                                      ?.imageUrl ||
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

                                  {contract?.contractor?.contractorProfile
                                    ?.designation && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                                      <span>
                                        {
                                          contract?.contractor
                                            ?.contractorProfile?.designation
                                        }
                                      </span>
                                    </div>
                                  )}

                                  <p
                                    className="info company-hover"
                                    onClick={() =>
                                      handlecheckProfile(
                                        contract?.contractor?.id
                                      )
                                    }
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
                                <ul className="flex2 gap-2">
                                  {contract?.signedDocument && (
                                    <div>
                                      <li>
                                        <a
                                          onClick={() =>
                                            handleDownloadDoc(
                                              contract?.signedDocument
                                            )
                                          }
                                          className="button-cancel-1 fw-7 remove-file"
                                        >
                                          Download Contract
                                        </a>
                                      </li>
                                    </div>
                                  )}

                                  <li>
                                    <div
                                      className={`status-capsule ${getStatusClass(
                                        contract?.status
                                      )}`}
                                    >
                                      {contract?.status}
                                    </div>
                                  </li>
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
          </section>
        ) : (
          <section className="flat-dashboard-resumes flat-dashboard-setting">
            <div className="themes-container_main">
              <div className="tf-tab">
                <div className="row">
                  <div className="col-lg-12 col-md-12 ">
                    <div className="wrap-profile instruction bg-white">
                      <div className="instruction_container  flex2 flex46">
                        <div className="group-title md:col-12 col-lg-9">
                          <h3 className="fw-6 color-3">Getting Started</h3>
                          <p className="mt-2">
                            This section provides an overview of all offers
                            received from companies. Here, you can review,
                            accept, or reject offers sent to you as a
                            contractor.
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
                              <span
                                style={{ color: "#FFA500", fontSize: "1.2em" }}
                              >
                                ⚠️
                              </span>
                              No Contracts Found
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

export default JobContracts;
