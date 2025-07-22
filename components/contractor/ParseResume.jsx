"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import mammoth from "mammoth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseResumeData } from "@/utils/parseResume";
import ShowParseCV from "@/components/contractor/ShowParseCV";
import Loader from "../loader/loader";

export default function ParseResume() {
  const token = useSelector((state) => state.currentUser.token);
  const [uploadedFiles, setUploadedFiles] = useState({
    docx: null,
    pdf: null,
  });

  const [formData, setFormData] = useState({
    experience: "",
    rate: "",
    currency: "",
    startTime: null,
    endTime: null,
    country: "",
    city: "",
    maxDays: "",
    willingToRelocate: "",
    availability: "",
  });

  const [parseCV, setparseCV] = useState(null);
  const [updateCV, setUpdatedCV] = useState();
  const [isToggle, setIsToggle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleFileUpload = async (e, fileType) => {
    let file;

    if (e.type === "drop") {
      e.preventDefault();
      file = e.dataTransfer.files[0];
    } else {
      file = e.target.files[0];
    }

    file = e.target.files[0];

    setUploadedFiles((prev) => ({
      ...prev,
      [fileType]: file,
    }));

    if (fileType === "docx") {
      const arrayBuffer = await file?.arrayBuffer();
      try {
        const { value: extractedText } = await mammoth.extractRawText({
          arrayBuffer,
        });

        const parsedData = parseResumeData(extractedText);
        setparseCV(parsedData);
      } catch (err) {
        console.error("Error parsing DOCX:", err);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    let newValue = type === "number" ? Number(value) : value;

    if (name === "maxDays") {
      newValue = Math.min(Math.max(newValue, 0), 5);
    }

    if (name === "experience") {
      newValue = Math.min(Math.max(newValue, 0), 50);
    }

    if (name === "rate") {
      newValue = Math.min(Math.max(newValue, 0), 200);
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsToggle(true);
  };

  const handleDownloadSampleCV = () => {
    const sampleCVUrl =
      "https://alpinum-consulting-bucket.s3.eu-north-1.amazonaws.com/Resume_Format.docx";
    const link = document.createElement("a");
    link.href = sampleCVUrl;
    link.download = "Resume_Format.docx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {!isLoading && (
        <div className="dashboard__content">
          <section className="page-title-dashboard">
            <div className="themes-container">
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="title-dashboard">
                    <div className="title-dash flex2">Upload Resume</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="flat-dashboard-resumes flat-dashboard-setting">
            <div className="themes-container">
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="profile-setting bg-white">
                    <div className="author-profile border-bt">
                      <div className="wd-file-apply style2">
                        <div className="content">
                          <div className="d-flex justify-start align-items-center mb-4 wd-form-login">
                            <button
                              onClick={handleDownloadSampleCV}
                              className="px-4 py-2 rounded-2xl"
                            >
                              <i className="icon-download me-2"></i>
                              Download Resume Template
                            </button>
                          </div>
                          <h3>Resume File</h3>
                          {/* ------popup */}
                          {isToggle && (
                            <ShowParseCV
                              parseCV={parseCV}
                              setUpdatedCV={setUpdatedCV}
                              formData={formData}
                              token={token}
                              onSuccess={() => {
                                setIsToggle(false);
                                router.push("/contractor/profile-overview");
                              }}
                              setIsLoading={setIsLoading}
                              uploadedFiles={uploadedFiles}
                              handleSubmit={handleSubmit}
                              onClose={() => setIsToggle(false)}
                            />
                          )}
                          <form onSubmit={handleSubmit}>
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
                                    accept=".doc,.docx"
                                    required
                                    onChange={(e) => handleFileUpload(e, "docx")}
                                  />

                                  <i className="file-icon icon-file-doc" />
                                </div>
                              </div>
                            </div>

                            <div className="form-infor flex flat-form ">
                              <div className="info-box info-wd">
                                <fieldset>
                                  <label className="form-label fs-16 fw-7">
                                    Total Years of Experience
                                  </label>
                                  <input
                                    required
                                    className="input-form2"
                                    label="Your Total Years of Experience"
                                    type="number"
                                    id="experience"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    placeholder="Enter your total years of experience"
                                  />
                                </fieldset>

                                <fieldset>
                                  <label className="form-label fs-16 fw-7">
                                    Are You Willing to Relocate?
                                  </label>
                                  <select
                                    required
                                    className="input-form2"
                                    id="willingToRelocate"
                                    name="willingToRelocate"
                                    value={formData.willingToRelocate}
                                    onChange={handleInputChange}
                                  >
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </select>
                                </fieldset>

                                <fieldset>
                                  <label className="form-label fs-16 fw-7">
                                    Expected Rate Per Hour
                                  </label>
                                  <input
                                    required
                                    type="number"
                                    className="input-form2"
                                    name="rate"
                                    id="rate"
                                    value={formData.rate}
                                    onChange={handleInputChange}
                                    placeholder="Enter your expected rate per hour"
                                  />
                                </fieldset>

                                <fieldset>
                                  <label className="form-label fs-16 fw-7">Currency</label>
                                  <select
                                    required
                                    id="currency"
                                    name="currency"
                                    className="input-form2"
                                    value={formData.currency}
                                    onChange={handleInputChange}
                                  >
                                    <option value="" className="input-form2">
                                      Select
                                    </option>
                                    <option value="USD">USD</option>
                                    <option value="GBP">GBP</option>
                                    <option value="EUR">EUR</option>
                                    <option value="INR">INR</option>
                                    <option value="AUD">AUD</option>
                                    <option value="CAD">CAD</option>
                                  </select>
                                </fieldset>
                                <fieldset>
                                  <label className="form-label fs-16 fw-7">Available From</label>

                                  <div className="border date-input-parent">
                                    <DatePicker
                                      required
                                      className="date-input border-0 date-style w-full"
                                      type="text"
                                      name="time"
                                      id="time"
                                      selected={formData.startTime}
                                      placeholder="Enter your Availability Time"
                                      onChange={(time) =>
                                        setFormData({
                                          ...formData,
                                          startTime: time ? new Date(time) : null,
                                        })
                                      }
                                      showTimeSelect
                                      showTimeSelectOnly
                                      timeIntervals={30}
                                      timeCaption="Time"
                                      dateFormat="h:mm aa"
                                      placeholderText="Select start time"
                                    />
                                  </div>
                                </fieldset>
                              </div>
                              <div className="info-box info-wd">
                                <fieldset>
                                  <label className="form-label fs-16 fw-7">
                                    Maximum Working Days in Office
                                  </label>

                                  <input
                                    required
                                    label="Maximum Days per Week Working in Office"
                                    type="number"
                                    id="maxDays"
                                    name="maxDays"
                                    className="input-form2"
                                    min={0}
                                    max={5}
                                    value={formData.maxDays}
                                    onChange={handleInputChange}
                                    placeholder="Enter number of days"
                                  />
                                </fieldset>
                                {formData.maxDays > 5 && (
                                  <small className="text-danger">
                                    Max 5 days allowed per week.
                                  </small>
                                )}
                                <fieldset>
                                  <label className="form-label fs-16 fw-7">
                                    Your Availability Date
                                  </label>
                                  <div className="border date-input-parent">
                                    <DatePicker
                                      required
                                      className="date-input border-0 date-style"
                                      selected={formData.availability}
                                      onChange={(date) =>
                                        setFormData({
                                          ...formData,
                                          availability: date
                                            ? new Intl.DateTimeFormat("en-US").format(date)
                                            : "null",
                                        })
                                      }
                                      minDate={new Date()}
                                      placeholderText="Select availability date"
                                      dateFormat="MM-dd-yyyy"
                                    />
                                  </div>
                                </fieldset>

                                <fieldset>
                                  <label className="form-label fs-16 fw-7">City</label>
                                  <input
                                    required
                                    label="City"
                                    type="text"
                                    id="city"
                                    name="city"
                                    className="input-form2"
                                    min={0}
                                    max={5}
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    placeholder="Enter your city"
                                  />
                                </fieldset>

                                <fieldset>
                                  <label className="form-label fs-16 fw-7">Country</label>
                                  <input
                                    required
                                    label="Your Country"
                                    type="text"
                                    id="country"
                                    name="country"
                                    className="input-form2"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    placeholder="Enter your country"
                                  />
                                </fieldset>
                                <fieldset>
                                  <label className="form-label fs-16 fw-7">Available Until</label>
                                  <div className="border date-input-parent">
                                    <DatePicker
                                      required
                                      className="date-input border-0 date-style"
                                      type="text"
                                      name="time"
                                      id="time"
                                      selected={formData.endTime}
                                      placeholder="Enter your Availability Time"
                                      onChange={(time) =>
                                        setFormData({
                                          ...formData,
                                          endTime: time,
                                        })
                                      }
                                      showTimeSelect
                                      showTimeSelectOnly
                                      timeIntervals={30}
                                      timeCaption="Time"
                                      dateFormat="h:mm aa"
                                      placeholderText="Select start time"
                                    />
                                  </div>
                                </fieldset>
                                <div className="w-100 d-flex justify-content-end">
                                  <div className="row mt-1  gap-3 wd-form-login wd-form-loginleft">
                                    <button type="onsubmit">Submit</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </form>
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

      {isLoading && (
        <div className="dashboard__content">
          <section className="page-title-dashboard">
            <div className="themes-container">
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="title-dashboard">
                    <div className="title-dash flex2">Upload Resume</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="flat-dashboard-resumes flat-dashboard-setting">
            <div className="themes-container">
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="profile-setting bg-white">
                    <div className="author-profile border-bt">
                      <div className="wd-file-apply style2">
                        <div className="content">
                          {/* <h3>Resume File</h3> */}
                          <div className="flex59">
                            <Loader />
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
}
