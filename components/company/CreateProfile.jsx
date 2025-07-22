"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../loader/loader";
import { useRouter } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreateCompanyProfile = () => {
  const router = useRouter();
  const token = useSelector((state) => state.currentUser.token);
  const [user, setUser] = useState({});
  const [company, setCompany] = useState({
    industry: "",
    companySize: "",
    description: "",
    address: "",
    foundedYear: "",
    website: "",
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
    try {
      e.preventDefault();

      const data = {
        ...socialLink,
        ...company,
      };

      const resp = await fetch("/api/company/company-profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await resp.json();

      if (!resp.ok) {
        toast.error(result.message);
      }
      router.push("/company/overview");
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
      setUser(result.companyProfile);
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
                <div className="title-dash flex2">Create Profile</div>
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
          {!isLoading &&
            (user &&
            !user.companySize &&
            !user.description &&
            !user.location &&
            !user.foundedYear ? (
              <form onSubmit={handlsubmit}>
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="profile-setting bg-white">
                      <div className="form-infor-profile">
                        <h3 className="title-info">General Information</h3>
                        <div className="form-infor flex flat-form">
                          <div className="info-box info-wd">
                            <fieldset>
                              <label className="title-user fw-7">Industry</label>
                              <input
                                type="text"
                                id="industry"
                                name="industry"
                                required
                                className="input-form2"
                                placeholder="Enter your Industry"
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
                                required
                                value={company?.companySize}
                                onChange={(e) =>
                                  setCompany({
                                    ...company,
                                    companySize: e.target.value,
                                  })
                                }
                                className="input-form2"
                                placeholder="Enter your Company Size"
                              />
                            </fieldset>
                            <fieldset>
                              <label className="title-user fw-7">Website</label>
                              <input
                                type="text"
                                id="website"
                                name="website"
                                required
                                placeholder="https://companyname.com"
                                value={company?.website}
                                onChange={(e) =>
                                  setCompany({
                                    ...company,
                                    website: e.target.value,
                                  })
                                }
                                className="input-form2"
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
                                required
                                value={company?.description}
                                className="input-form2"
                                placeholder="Please Add description"
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
                                required
                                className="input-form2 input-Date w-100"
                                selected={
                                  company?.foundedYear ? new Date(company.foundedYear) : null
                                }
                                onChange={(date) =>
                                  setCompany({
                                    ...company,
                                    foundedYear: date ? date.getFullYear().toString() : "",
                                  })
                                }
                                showYearPicker
                                dateFormat="yyyy"
                                placeholderText="Enter founded year"
                                maxDate={new Date()}
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
                                {/* <span className="icon-facebook" /> */}
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
                                  placeholder="Enter your Address"
                                  id="address"
                                  name="address"
                                  min={10}
                                  max={10000}
                                  required
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
            ) : (
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div
                    className="profile-setting bg-white"
                    style={{
                      height: "500px",
                    }}
                  >
                    <div className="form-infor-profile">
                      <h3 className="title-info">Profile Information</h3>
                      <div className="form-infor flex flat-form">
                        <div className="themes-container">
                          <div className="row">
                            <div className="col-lg-12 col-md-12">
                              <div className="wrap-profile  bg-white">
                                <div className="box-profile">
                                  <div className="images">
                                    <img
                                      alt=""
                                      style={{
                                        objectFit: "cover",
                                        objectPosition: "center",
                                      }}
                                      src={
                                        "https://incongressnewfrontiers.it/wp-content/uploads/2022/08/profile-placeholder.jpg"
                                      }
                                      width={120}
                                      height={120}
                                    />
                                  </div>
                                </div>
                                <div className="tt-button tt-button2">
                                  <a href="/company/edit-profile">Edit Profile</a>
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
            ))}
        </div>
      </section>
    </div>
  );
};

export default CreateCompanyProfile;
