"use client";
import React, { useState } from "react";

const VerifyEmail = () => {
  const [verifyCode, setVerifyCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  };
  return (
    <section className="account-section">
      <div className="tf-container">
        <div className="row">
          <div className="wd-form-login tf-tab">
            <h4>Please Verify your Code</h4>
            <ul className="menu-tab"></ul>
            <div className="content-tab">
              <div className="inner">
                <form onSubmit={handleSubmit}>
                  <div className="ip">
                    <label>
                      Verify Code<span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      value={verifyCode}
                      onChange={(e) => setVerifyCode(e.target.value)}
                      placeholder="6-digit code"
                    />
                  </div>

                  <button type="submit">Verify Code</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyEmail;
