"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showPass1, setShowPass1] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const params = useSearchParams();
  const token = params.get("token");
  const router = useRouter();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          token: token,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        return toast.error(result.error || "something went wrong");
      }

      if (response.status === 200) {
        toast.success(result.message);
        router.push("/");
      }
    } catch (err) {
      toast.error("Something went wrong during login", err);
      console.error("err", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="account-section">
      <div className="tf-container">
        <div className="row">
          <div className="wd-form-login">
            <Image
              style={{ marginBottom: "20px" }}
              src="/images/logo/old-logo.png"
              alt="login"
              width={150}
              height={150}
            />
            <h4>Reset Password</h4>
            <p className="password-description">
              Create a new secure password that you don't use for other websites and is not easy to
              guess.
            </p>

            <form onSubmit={handleResetPassword}>
              <div className="ip">
                <label>
                  New Password<span className="required">*</span>
                </label>
                <div className="inputs-group auth-pass-inputgroup">
                  <input
                    value={formData.password}
                    type={showPass ? "text" : "password"}
                    className="input-form password-input"
                    placeholder="Password"
                    id="password-input"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                    required
                  />
                  <a
                    className={`icon-eye${!showPass ? "-off" : ""} password-addon`}
                    onClick={() => setShowPass((pre) => !pre)}
                    id="password-addon"
                  />
                </div>
              </div>
              <div className="ip">
                <label>
                  Confirm Password<span className="required">*</span>
                </label>
                <div className="inputs-group auth-pass-inputgroup">
                  <input
                    value={formData.confirmPassword}
                    type={showPass1 ? "text" : "password"}
                    className="input-form password-input"
                    placeholder="Password"
                    id="password-input"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                  <a
                    className={`icon-eye${!showPass1 ? "-off" : ""} password-addon`}
                    onClick={() => setShowPass1((pre) => !pre)}
                    id="password-addon"
                  />
                </div>
              </div>
              {/* <div className="group-ant-choice">
                <div className="sub-ip">
                  <input type="checkbox" />
                  Remember Me
                </div>
                <Link href={`auth/forgot-password`} className="forgot">
                  Forgot Password?
                </Link>
              </div> */}
              {/* <p className="line-ip">
                <span>or sign up with</span>
              </p>
              <a href="#" className="btn-social">
                Continue with Facebook
              </a>
              <a href="#" className="btn-social">
                <Image alt="images" src="/images/review/google.png" width={25} height={24} />
                Continue with Google
              </a>
              <a href="#" className="btn-social">
                <Image alt="images" src="/images/review/tweet.png" width={25} height={20} />
                Continue with Twitter
              </a> */}

              <button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <span>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>
              <div className="sign-up">
                Sign In again? <Link href={`/auth`}>Sign In Here</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
