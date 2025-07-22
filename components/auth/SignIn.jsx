"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "@/context/slice";
import Image from "next/image";

export default function SignIn() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        return toast.error(result.error || "something went wrong");
      }

      toast.success(result.message);
      dispatch(setToken(result.token));
      dispatch(setUser(result.user));
      router.push("/contractor/dashboard");
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
            <h4>Welcome Back</h4>

            <form onSubmit={handleLogin}>
              <div className="ip">
                <label>
                  Email Address<span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email"
                />
              </div>
              <div className="ip">
                <label>
                  Password<span className="required">*</span>
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
              <div className="group-ant-choice">
                <div className="sub-ip">
                  <input type="checkbox" />
                  Remember Me
                </div>
                <Link href={`/auth/forgot-password`} className="forgot">
                  Forgot Password?
                </Link>
              </div>
              <button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <span>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
              <div className="sign-up">
                Not registered yet? <Link href={`/auth/sign-up`}>Sign Up Here</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
