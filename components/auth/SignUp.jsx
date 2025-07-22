"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";

export default function SignUp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [showPass3, setShowPass3] = useState(false);
  const [showPass4, setShowPass4] = useState(false);
  const [activeTab, setActiveTab] = useState("Contractor");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    let userRole = "";
    let payload = {};

    if (activeTab === "Contractor") {
      userRole = "CONTRACTOR";
      payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        userRole,
      };
    } else if (activeTab === "Company") {
      userRole = "COMPANY";
      payload = {
        companyName: formData.companyName,
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        userRole,
      };
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error);
      }

      if (response.status === 201) {
        toast.success(data.message);
        if (data.user.role === "CONTRACTOR") {
          router.push("/");
        }
        if (data.user.role === "COMPANY") {
          router.push("/company-dashboard");
        }
      }
    } catch (err) {
      toast.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = ["Contractor", "Company"];
  return (
    <section className="account-section">
      <div className="tf-container">
        <div className="row">
          <div className="wd-form-login tf-tab">
            <Image
              style={{ marginBottom: "20px" }}
              src="/images/logo/old-logo.png"
              alt="login"
              width={150}
              height={150}
            />
            <h4>Create An Account</h4>
            <ul className="menu-tab">
              {tabs.map((tab) => (
                <li
                  key={tab}
                  className={`ct-tab ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </li>
              ))}
            </ul>
            <div className="content-tab">
              {activeTab == "Contractor" && (
                <div className="inner">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 text-start">
                        <div className="ip">
                          <label>
                            First Name<span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                firstName: e.target.value,
                              })
                            }
                            placeholder="First Name"
                          />
                        </div>
                      </div>
                      <div className="col-md-6 text-start">
                        <div className="ip">
                          <label>
                            Last Name<span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lastName: e.target.value,
                              })
                            }
                            placeholder="Last Name"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="ip">
                      <label>
                        Email<span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            email: e.target.value,
                          })
                        }
                        placeholder="Email"
                      />
                    </div>
                    <div className="ip">
                      <label>
                        Password<span className="required">*</span>
                      </label>
                      <div className="inputs-group auth-pass-inputgroup">
                        <input
                          type={showPass1 ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password: e.target.value,
                            })
                          }
                          className="input-form password-input"
                          placeholder="Password"
                          required
                        />
                        <a
                          className={`icon-eye${!showPass1 ? "-off" : ""} password-addon`}
                          onClick={() => setShowPass1((pre) => !pre)}
                        />
                      </div>
                    </div>
                    <div className="ip">
                      <label>
                        Confirm Password<span className="required">*</span>
                      </label>
                      <div className="inputs-group auth-pass-inputgroup">
                        <input
                          type={showPass2 ? "text" : "password"}
                          value={formData.confirmPassword}
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
                          className={`icon-eye${!showPass2 ? "-off" : ""} password-addon`}
                          onClick={() => setShowPass2((pre) => !pre)}
                        />
                      </div>
                    </div>

                    <div className="group-ant-choice st">
                      <div className="sub-ip">
                        <input type="checkbox" required />I agree to the
                        <a href="#"> Terms of User</a>
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
                          Signing Up...{" "}
                        </span>
                      ) : (
                        "Sign Up"
                      )}
                    </button>
                    <div className="sign-up">
                      Already have an account?
                      <Link href={`/sign-in`}> Sign In Here</Link>
                    </div>
                  </form>
                </div>
              )}
              {activeTab == "Company" && (
                <div className="inner">
                  <form onSubmit={handleSubmit}>
                    <div className="ip">
                      <label>
                        Company Name<span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={formData.companyName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            companyName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="ip">
                      <label>
                        Email<span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="ip">
                      <label>
                        Password<span className="required">*</span>
                      </label>
                      <div className="inputs-group auth-pass-inputgroup">
                        <input
                          type={showPass3 ? "text" : "password"}
                          className="input-form password-input"
                          placeholder="Password"
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password: e.target.value,
                            })
                          }
                          required
                        />
                        <a
                          className={`icon-eye${!showPass3 ? "-off" : ""} password-addon`}
                          onClick={() => setShowPass3((pre) => !pre)}
                        />
                      </div>
                    </div>
                    <div className="ip">
                      <label>
                        Confirm Password<span className="required">*</span>
                      </label>
                      <div className="inputs-group auth-pass-inputgroup">
                        <input
                          type={showPass4 ? "text" : "password"}
                          className="input-form password-input"
                          placeholder="Password"
                          required
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              confirmPassword: e.target.value,
                            })
                          }
                        />
                        <a
                          className={`icon-eye${!showPass4 ? "-off" : ""} password-addon`}
                          onClick={() => setShowPass4((pre) => !pre)}
                        />
                      </div>
                    </div>
                    <div className="group-ant-choice st">
                      <div className="sub-ip">
                        <input type="checkbox" />I agree to the
                        <a href="#"> Terms of User</a>
                      </div>
                    </div>

                    <button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <span>
                          Signing Up
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            aria-hidden="true"
                          ></span>
                        </span>
                      ) : (
                        "Sign Up"
                      )}
                    </button>
                    <div className="sign-up">
                      Already have an account? <Link href={`/login`}> Login Here</Link>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
