import ResetPassword from "@/components/auth/ResetPassword";
import React from "react";
import { ToastContainer } from "react-toastify";

export const metadata = {
  title: "Reset Password - Alpinum Consulting",
  description: "Alpinum Consulting",
};

export default function ResetPasswordPage() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <ResetPassword />
    </>
  );
}
