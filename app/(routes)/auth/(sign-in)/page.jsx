import React from "react";
import SignIn from "@/components/auth/SignIn";
import { ToastContainer } from "react-toastify";

export const metadata = {
  title: "Sign In - Alpinum Consulting",
  description: "Alpinum Consulting",
};

export default function SignInPage() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <SignIn />
    </>
  );
}
