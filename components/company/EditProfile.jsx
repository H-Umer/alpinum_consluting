"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loader from "../loader/loader";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditComapanyProfile = () => {
  const router = useRouter();
  const token = useSelector((state) => state.currentUser.token);
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [company, setCompany] = useState({
    companyName: "",
    industry: "",
    companySize: "",
    description: "",
    address: "",
    website: "",
    foundedYear: "",
  });

  const [socialLink, setSocialLink] = useState({
    github: "",
    linkedIn: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      getUserDetails();
    }
  }, [token]);

  const handlsubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const formData = new FormData();

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const data = {
        ...socialLink,
        ...company,
      };

      formData.append("data", JSON.stringify(data));

      const resp = await fetch("/api/company/company-profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const result = await resp.json();

      if (!resp.ok) {
        toast.error(result.error);
      }
      if (resp.status === 201) {
        toast.success("Profile Updated Successfully!");
        router.push("/company/overview");
      }
    } catch (error) {
      toast.error(error.error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserDetails = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch("/api/company/company-profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await resp.json();
      if (!resp.ok) {
        toast.error(result.message);
      }

      setLogoUrl(result?.companyProfile?.logoUrl);

      setCompany({
        ...company,
        companyName: result?.companyProfile?.companyName,
        companySize: result?.companyProfile?.companySize,
        industry: result?.companyProfile?.industry,
        description: result?.companyProfile?.description,
        address: result?.companyProfile?.location,
        website: result?.companyProfile?.website,
        foundedYear: Number(result?.companyProfile?.foundedYear),
      });

      setSocialLink({
        ...socialLink,
        github:
          result?.companyProfile?.socialLinks.find((el) => el.platform === "github")?.url || "",
        website:
          result?.companyProfile?.socialLinks.find((el) => el.platform === "website")?.url || "",
        linkedIn:
          result?.companyProfile?.socialLinks.find((el) => el.platform === "linkedIn")?.url || "",
      });
    } catch (error) {
      toast.error(error.error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image Size Should Be Less Than 5MB!");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please Upload An Image File!");
        return;
      }

      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="dashboard__content">
      <section className="page-title-dashboard">
        <div className="themes-container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="title-dashboard">
                <div className="title-dash flex2">Edit Profile</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="flat-dashboard-setting flat-dashboard-setting2">
        <div className="themes-container">
          {isLoading && (
            <div className="flex59">
              <Loader />
            </div>
          )}
          {!isLoading && (
            <form onSubmit={handlsubmit}>
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="profile-setting bg-white">
                    <div className="form-infor-profile">
                      <h3 className="title-info">General Information</h3>

                      <div className="profile-image-upload" style={{ marginBottom: "30px" }}>
                        <div
                          className="image-upload-container"
                          style={{ display: "flex", alignItems: "center", gap: "20px" }}
                        >
                          <div>
                            <img
                              alt="Company Logo"
                              style={{
                                objectFit: "cover",
                                objectPosition: "center",
                                border: "1px solid #e4e4e4",
                                width: "120px",
                                height: "120px",
                                borderRadius: "5%",
                              }}
                              src={previewUrl || logoUrl || "/images/profile/placeholder.jpg"}
                            />
                          </div>
                          <div className="upload-controls" style={{ flex: 1 }}>
                            <label className="title-user fw-7">Company Logo</label>
                            <div style={{ marginTop: "8px" }}>
                              <input
                                type="file"
                                accept="image/jpeg, image/png"
                                onChange={handleImageChange}
                                style={{ display: "none" }}
                                id="profile-image-input"
                              />
                              <label
                                htmlFor="profile-image-input"
                                style={{
                                  padding: "10px 16px",
                                  backgroundColor: "#f47920",
                                  color: "white",
                                  borderRadius: "4px",
                                  fontWeight: "600",
                                  fontSize: "14px",
                                  cursor: "pointer",
                                  display: "inline-block",
                                }}
                              >
                                Choose Image
                              </label>
                              <small style={{ display: "block", marginTop: "8px", color: "#666" }}>
                                Maximum file size: 5MB. Supported formats: JPG, PNG
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="form-infor flex flat-form">
                        <div className="info-box info-wd">
                          <fieldset>
                            <label className="title-user fw-7">Company Name</label>
                            <input
                              type="text"
                              id="companyName"
                              name="companyName"
                              value={company?.companyName || ""}
                              required
                              className="input-form2"
                              placeholder="Enter company name"
                              onChange={(e) => {
                                setCompany({
                                  ...company,
                                  companyName: e.target.value,
                                });
                              }}
                            />
                          </fieldset>
                          <fieldset>
                            <label className="title-user fw-7">Industry</label>
                            <input
                              type="text"
                              id="industry"
                              name="industry"
                              className="input-form2"
                              placeholder="Enter your industry"
                              onChange={(e) =>
                                setCompany({
                                  ...company,
                                  industry: e.target.value,
                                })
                              }
                              value={company?.industry || ""}
                            />
                          </fieldset>
                          <fieldset>
                            <label className="title-user fw-7">Company Size</label>
                            <input
                              type="number"
                              id="companySize"
                              name="companySize"
                              value={company?.companySize || ""}
                              onChange={(e) =>
                                setCompany({
                                  ...company,
                                  companySize: e.target.value,
                                })
                              }
                              className="input-form2"
                              placeholder="Enter your company size"
                            />
                          </fieldset>
                        </div>
                        <div className="info-box info-wd">
                          <fieldset>
                            <label className="title-user fw-7">Description</label>
                            <input
                              type="text"
                              id="description"
                              name="description"
                              value={company?.description || ""}
                              className="input-form2"
                              placeholder="Enter your company description"
                              onChange={(e) => {
                                setCompany({
                                  ...company,
                                  description: e.target.value,
                                });
                              }}
                            />
                          </fieldset>

                          <fieldset
                            style={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <label className="title-user fw-7">Founded Year</label>

                            <DatePicker
                              className="input-form2 input-Date w-100"
                              selected={
                                company.foundedYear
                                  ? new Date(parseInt(company.foundedYear), 0)
                                  : null
                              }
                              onChange={(date) =>
                                setCompany({
                                  ...company,
                                  foundedYear: date ? date.getFullYear().toString() : "",
                                })
                              }
                              showYearPicker
                              dateFormat="yyyy"
                              placeholderText="Enter company founded year"
                              maxDate={new Date()}
                            />
                          </fieldset>

                          <fieldset>
                            <label className="title-user fw-7">Website</label>
                            <input
                              type="text"
                              className="input-form2"
                              placeholder="Enter your company website"
                              id="website"
                              name="website"
                              onChange={(e) =>
                                setCompany({
                                  ...company,
                                  website: e.target.value,
                                })
                              }
                              value={company?.website || ""}
                            />
                          </fieldset>
                        </div>
                      </div>

                      <div
                        className="social-wrap border-bt"
                        style={{
                          marginTop: "10px",
                          paddingTop: "20px",
                          borderTop: "1px solid #e5e5e5",
                        }}
                      >
                        <h3>Social Networks</h3>
                        <div className="form-social form-wg flex flat-form">
                          <div className="form-box info-wd wg-box">
                            <fieldset className="flex2">
                              <span className="icon-github2 githubiconStyle">
                                <FaGithub />
                              </span>
                              <input
                                type="text"
                                id="github"
                                name="github"
                                placeholder="https://github.com"
                                className="input-form2"
                                value={socialLink?.github || ""}
                                onChange={(e) => {
                                  setSocialLink({
                                    ...socialLink,
                                    github: e.target.value,
                                  });
                                }}
                              />
                            </fieldset>
                          </div>
                          <div className="form-box info-wd wg-box">
                            <fieldset className="flex2">
                              <span className="icon-linkedin2" />
                              <input
                                type="text"
                                className="input-form2"
                                placeholder="https://linkedin.com"
                                id="linkedIn"
                                name="linkedIn"
                                value={socialLink?.linkedIn || ""}
                                onChange={(e) => {
                                  setSocialLink({
                                    ...socialLink,
                                    linkedIn: e.target.value,
                                  });
                                }}
                              />
                            </fieldset>
                          </div>
                        </div>
                      </div>

                      <div className="contact-wrap  info-wd">
                        <h3>Location Information</h3>

                        <div className="form-social form-wg flex flat-form">
                          <div className="form-box wg-box">
                            <fieldset className="">
                              <label className="title-user fw-7">Address</label>
                              <input
                                type="text"
                                className="input-form2"
                                placeholder="Enter your company address"
                                id="address"
                                name="address"
                                min={10}
                                max={10000}
                                value={company?.address || ""}
                                onChange={(e) =>
                                  setCompany({
                                    ...company,
                                    address: e.target.value,
                                  })
                                }
                              />
                            </fieldset>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-100 d-flex justify-content-end">
                      <div className="row mt-1  gap-3 wd-form-login wd-form-loginleft">
                        <button href="#" type="onsubmit" className="">
                          Save Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default EditComapanyProfile;
