"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../loader/loader";

const CompanyDocuments = () => {
  const [file, setFile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector((state) => state.currentUser.token);

  const handleFileUpload = async (e) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      const formData = new FormData();
      formData.append("file", file);
      const resp = await fetch("/api/company/company-documents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const result = await resp.json();
    } catch (error) {
      toast.error(error.error);
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
                  <div className="title-dash flex2">Verify Documents</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {!isLoading ? (
          <section className="flat-dashboard-resumes flat-dashboard-setting">
            <div className="themes-container_main">
              <form onSubmit={handleFileUpload}>
                <div className="row">
                  <div className="col-lg-12 col-md-12 ">
                    <div className="profile-setting bg-white">
                      <h4
                        style={{
                          marginBottom: "15px",
                        }}
                      >
                        Documents
                      </h4>
                      <div className="wd-file-apply style2">
                        <div className="content">
                          <div className="group-seclect-file">
                            <div className="group-file">
                              <div className="inner left">
                                <div className="title-box">
                                  <div className="fs-16 fw-7">Doc</div>
                                </div>

                                <input
                                  id="docx-upload"
                                  type="file"
                                  className="sr-only"
                                  accept=".pdf"
                                  required
                                  onChange={(e) => setFile(e.target.files[0])}
                                />

                                <i className="file-icon icon-file-doc" />
                              </div>
                            </div>
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
                              fontSize: "18px",
                            }}
                          >
                            save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </section>
        ) : (
          <section className="flat-dashboard-user flat-dashboard-profile">
            <div className="themes-container">
              <div className="flex59">
                <Loader />
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default CompanyDocuments;
