import React from "react";
import ForgotPassword from "@/components/auth/ForgotPassword";
import { ToastContainer } from "react-toastify";

export const metadata = {
  title: "Forgot Password - Alpinum Consulting",
  description: "Alpinum Consulting",
};

export default function ForgotPasswordPage() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <ForgotPassword />
    </>
  );
}
