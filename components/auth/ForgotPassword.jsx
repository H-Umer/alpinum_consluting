"use client";
import React, { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import Image from "next/image";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return toast.error(result.error || "something went wrong");
      }

      toast.success(result.message);
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
          <div className="wd-form-login forget-password">
            <Image
              style={{ marginBottom: "20px" }}
              src="/images/logo/old-logo.png"
              alt="login"
              width={150}
              height={150}
            />
            <h4>Forgot Password</h4>
            <p className="password-description">
              Enter your email address below and we'll send you instructions to reset your password.
            </p>

            <form onSubmit={handleForgotSubmit}>
              <div className="ip">
                <label>
                  Email Address<span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email"
                  required
                />
              </div>

              <button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <span>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Sending Email...
                  </span>
                ) : (
                  "Send Email"
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
