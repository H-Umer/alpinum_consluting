"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../loader/loader";

export default function ChangePassword() {
  const router = useRouter();
  const token = useSelector((state) => state.currentUser.token);
  const [showPass1, setShowPass1] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.status === 201) {
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        toast.success(result.message);
        router.push("/contractor/dashboard");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="dashboard__content">
          <section className="page-title-dashboard">
            <div className="themes-container">
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="title-dashboard">
                    <div className="title-dash flex2">Change Password</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="flat-dashboard-resumes flat-dashboard-setting">
            <div className="themes-container">
              <div className="flex59">
                <Loader />
              </div>
            </div>
          </section>
        </div>
      )}
      {!isLoading && (
        <div className="dashboard__content">
          <section className="page-title-dashboard">
            <div className="themes-container">
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="title-dashboard">
                    <div className="title-dash flex2">Change Password</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="flat-dashboard-resumes flat-dashboard-setting">
            <div className="themes-container_main">
              <div className="wd-form-login wd-form_login tf-tab">
                <div className="row">
                  <div className="col-lg-12 col-md-12 ">
                    <div className="profile-setting bg-white">
                      <div className="author-profile border-bt">
                        <div className="wd-file-apply style2">
                          <div className="content">
                            <div className="inner">
                              <form onSubmit={handleSubmit}>
                                <div className="ip">
                                  <label>
                                    Current Password<span>*</span>
                                  </label>
                                  <div className="inputs-group auth-pass-inputgroup">
                                    <input
                                      type={showPass ? "text" : "password"}
                                      value={formData.password}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          currentPassword: e.target.value,
                                        })
                                      }
                                      className="input-form password-input"
                                      placeholder="Password"
                                      required
                                    />
                                    <a
                                      className={`icon-eye${
                                        !showPass ? "-off" : ""
                                      } password-addon`}
                                      onClick={() => setShowPass((pre) => !pre)}
                                    />
                                  </div>
                                </div>
                                <div className="ip">
                                  <label>
                                    New Password<span>*</span>
                                  </label>
                                  <div className="inputs-group auth-pass-inputgroup">
                                    <input
                                      type={showPass1 ? "text" : "password"}
                                      value={formData.password}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          newPassword: e.target.value,
                                        })
                                      }
                                      className="input-form password-input"
                                      placeholder="Password"
                                      required
                                    />
                                    <a
                                      className={`icon-eye${
                                        !showPass1 ? "-off" : ""
                                      } password-addon`}
                                      onClick={() => setShowPass1((pre) => !pre)}
                                    />
                                  </div>
                                </div>
                                <div className="ip">
                                  <label>
                                    Confirm Password<span>*</span>
                                  </label>
                                  <div className="inputs-group auth-pass-inputgroup">
                                    <input
                                      type={showPass2 ? "text" : "password"}
                                      value={formData.password}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          confirmPassword: e.target.value,
                                        })
                                      }
                                      className="input-form password-input"
                                      placeholder="Password"
                                      required
                                    />
                                    <a
                                      className={`icon-eye${
                                        !showPass2 ? "-off" : ""
                                      } password-addon`}
                                      onClick={() => setShowPass2((pre) => !pre)}
                                    />
                                  </div>
                                </div>

                                <button type="submit" disabled={isLoading}>
                                  {isLoading ? (
                                    <span>
                                      <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                      ></span>
                                      Changing...{" "}
                                    </span>
                                  ) : (
                                    "Change Password"
                                  )}
                                </button>
                              </form>
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
}
