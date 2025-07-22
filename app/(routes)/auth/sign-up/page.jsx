import SignUp from "@/components/auth/SignUp";
import React from "react";
import { ToastContainer } from "react-toastify";

export const metadata = {
  title: "Create Account - Alpinum Consulting",
  description: "Alpinum Consulting",
};

export default function SignUpPage() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <SignUp />
    </>
  );
}
