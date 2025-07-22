import VerifyEmail from "@/components/auth/VerifyEmail";
import React from "react";
import { ToastContainer } from "react-toastify";

export const metadata = {
  title: "Verify Email - Alpinum Consulting",
  description: "Alpinum Consulting",
};

export default function VerifyEmailPage() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <VerifyEmail />
    </>
  );
}
