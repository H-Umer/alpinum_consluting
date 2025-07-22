"use client";
import { useState } from "react";
import Loader from "../loader/loader";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const OfferContractDocument = ({ params }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [docxFile, setDocxFile] = useState(null);
  const token = useSelector((state) => state.currentUser.token);
  const contractorId = params.id;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setDocxFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      e.preventDefault();

      const formData = new FormData();
      formData.append("file", docxFile);
      formData.append("contractorId", contractorId);

      const resp = await fetch("/api/company/company-documents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await resp.json();

      if (!resp.ok) {
        toast.error(result.error);
      }
      toast.success(result.message);
      router.push("/company/job-contracts");
    } catch (error) {
      toast.error(error.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard__content">
      <section className="page-title-dashboard">
        <div className="themes-container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="title-dashboard">
                <div className="title-dash flex2">Offer Contract</div>
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
        <section className="flat-dashboard-resumes flat-dashboard-setting">
          <div className="themes-container_main">
            <div className="tf-tab">
              <div className="row">
                <div className="col-lg-12 col-md-12 ">
                  <div className="wrap-profile instruction bg-white">
                    <div className="instruction_container  flex2 flex46">
                      <div className="group-title md:col-12 col-lg-9">
                        <h3 className="fw-6 color-3">Contract Document</h3>
                        <p className="mt-2">
                          Upload the contract document to send the request to the contractor
                        </p>
                      </div>
                    </div>
                  </div>

                  <section className="flat-dashboard-resumes flat-dashboard-setting">
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <div className="profile-setting bg-white">
                          <div className="author-profile">
                            <div className="wd-file-apply style2">
                              <div className="content">
                                <form onSubmit={handleSubmit}>
                                  <div className="group-seclect-file">
                                    <div className="group-file">
                                      <div className="inner left">
                                        <div className="title-box">
                                          <div className="fs-16 fw-7">Upload Document</div>
                                        </div>

                                        <input
                                          style={{
                                            marginTop: "10px",
                                            width: "100%",
                                          }}
                                          id="docx-upload"
                                          type="file"
                                          className="sr-only"
                                          accept=".pdf"
                                          required
                                          onChange={handleFileChange}
                                        />

                                        <i className="file-icon icon-file-doc" />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="w-100 d-flex justify-content-end">
                                    <div className="row mt-1  gap-3 wd-form-login wd-form-loginleft">
                                      <button
                                        href="#"
                                        type="onsubmit"
                                        style={{
                                          width: "140px",
                                        }}
                                      >
                                        Submit
                                      </button>
                                    </div>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default OfferContractDocument;
