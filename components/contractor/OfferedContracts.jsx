"use client";

import { useEffect, useState } from "react";
import Loader from "../loader/loader";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import SignatureModal from "../common/SignatureModal";

const OfferedContracts = () => {
  const router = useRouter();
  const token = useSelector((state) => state.currentUser.token);
  const [isLoading, setIsloading] = useState(false);
  const [offers, setOffers] = useState(null);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState(null);

  useEffect(() => {
    if (token) {
      getOffers();
    }
  }, [token]);

  const getOffers = async () => {
    setIsloading(true);
    try {
      const resp = await fetch("/api/offers", {
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

      setOffers(result.offers);
    } catch (error) {
      toast.error(error.error);
    } finally {
      setIsloading(false);
    }
  };

  const handleCheckCompany = (id) => {
    try {
      setIsloading(true);
      router.push(`/contractor/offers/${id}`);
    } catch (error) {
      console.log("error", error);
      toast.error(error);
    } finally {
      setIsloading(false);
    }
  };

  const handleOfferStatus = async (offerId, companyId, contractorId, status) => {
    if (status === "ACCEPTED") {
      setIsSignatureModalOpen(true);
      setSelectedContractId(offerId);
      return;
    } else if (status === "REJECTED") {
      const data = {
        offerId: offerId,
        companyId: companyId,
        contractorId: contractorId,
        status: status,
      };
      try {
        setIsloading(true);
        const resp = await fetch("/api/offers", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const result = await resp.json();
        if (!resp.ok) {
          toast.error(result.error);
        }
        setOffers(result.offers);
      } catch (error) {
        toast.error(error.error);
      } finally {
        setIsloading(false);
      }
    }
  };

  const handleDownloadDoc = (doc) => {
    if (!doc) {
      console.error("No file URL found");
      return;
    }
    const link = document.createElement("a");
    link.href = doc;
    link.download = doc.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  return (
    <div className="dashboard__content">
      <section className="page-title-dashboard">
        <div className="themes-container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="title-dashboard">
                <div className="title-dash flex2">Contract Offers</div>
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
        (offers?.length > 0 ? (
          <section className="flat-dashboard-resumes flat-dashboard-setting">
            <div className="themes-container_main">
              <div className="tf-tab">
                <div className="row">
                  <div className="col-lg-12 col-md-12 ">
                    <div className="wrap-profile instruction bg-white">
                      <div className="instruction_container  flex2 flex46">
                        <div className="group-title md:col-12 col-lg-12">
                          <h3 className="fw-6 color-3">Contract Offers Management</h3>
                          <p className="mt-2">
                            Review and manage all contract offers received from companies. Take
                            action on pending offers, track accepted contracts, and maintain a clear
                            overview of your professional opportunities.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="profile-setting bg-white">
                      <div>
                        {offers?.map((offer, i) => (
                          <div key={i} className="employer-block style-2 cl2">
                            <div
                              className="inner-box"
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: "10px",
                              }}
                            >
                              <div className="contractor-offer-cards">
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
                                    offer?.company?.companyProfile?.logoUrl ||
                                    "/images/profile/placeholder.jpg"
                                  }
                                  width={120}
                                  height={120}
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
                                    {offer?.company?.companyProfile?.companyName}
                                  </h3>

                                  {offer?.company?.companyProfile?.industry && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                                      <span>{offer?.company?.companyProfile?.industry}</span>
                                    </div>
                                  )}

                                  <p
                                    className="info company-hover"
                                    onClick={() =>
                                      handleCheckCompany(offer?.company?.companyProfile?.id)
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

                              {offer?.status === "PENDING" ? (
                                <div className="action-wrap">
                                  <ul className="flex2 gap-2">
                                    <div
                                      style={{
                                        cursor: "pointer",
                                      }}
                                      className="offer-downloadButton"
                                      onClick={() => handleDownloadDoc(offer?.contractDocument)}
                                    >
                                      <li className="hv-tool" data-tooltip="Download CV">
                                        <a
                                          style={{ color: "#F47920" }}
                                          className="action-icon icon-download offer-button"
                                        />
                                      </li>
                                    </div>
                                    <li>
                                      <a
                                        onClick={() =>
                                          handleOfferStatus(
                                            offer?.id,
                                            offer?.companyId,
                                            offer?.contractorId,
                                            "ACCEPTED"
                                          )
                                        }
                                        className="button-cancel-1 fw-7 remove-file"
                                      >
                                        Accept
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        onClick={() =>
                                          handleOfferStatus(
                                            offer?.id,
                                            offer?.companyId,
                                            offer?.contractorId,
                                            "REJECTED"
                                          )
                                        }
                                        className="button-cancel-1 fw-7 remove-file"
                                      >
                                        Reject
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              ) : (
                                <div className="action-wrap">
                                  <ul className="flex2 gap-2">
                                    <li>
                                      <div
                                        className={`status-capsule ${getStatusClass(
                                          offer?.status
                                        )}`}
                                      >
                                        {offer?.status}
                                      </div>
                                    </li>
                                  </ul>
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
                            This section provides an overview of all offers received from companies.
                            Here, you can review, accept, or reject offers sent to you as a
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
                              {" "}
                              <span style={{ color: "#FFA500", fontSize: "1.2em" }}>⚠️</span>
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
      <SignatureModal
        isOpen={isSignatureModalOpen}
        loading={() => setIsloading(true)}
        onClose={() => setIsSignatureModalOpen(false)}
        onSave={() => {
          setIsSignatureModalOpen(false);
          setSelectedContractId(null);
          getOffers();
        }}
        contractId={selectedContractId}
        contractDocument={offers?.find((o) => o?.id === selectedContractId)?.contractDocument}
      />
    </div>
  );
};

export default OfferedContracts;
