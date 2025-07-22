import React from "react";

export default function layout({ children }) {
  return (
    <>
      <div className="dashboard show dashboard-height-set2">{children}</div>
    </>
  );
}
