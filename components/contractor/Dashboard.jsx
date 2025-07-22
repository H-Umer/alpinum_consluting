"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../loader/loader";

export default function Dashboard() {
  const router = useRouter();
  const user = useSelector((state) => state.currentUser.user);
  const token = useSelector((state) => state.currentUser.token);
  const [incompleteProfile, setIncompleteProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchContractorDetails();
    }
  }, [token]);

  useEffect(() => {
    if (user.role !== "CONTRACTOR") {
      router.replace("/company/dashboard");
    }
  }, [user]);

  const fetchContractorDetails = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch("/api/contractor-profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await resp.json();

      setIncompleteProfile(
        result?.CV?.availabilityDays?.length === 0 || !result?.CV?.startTime || !result?.CV?.endTime
      );

      if (!response.ok) {
        return toast.error(result.error || "Oops! Something Went Wrong!");
      }
    } catch (err) {
      toast.error(err.err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="dashboard__content">
        <section className="page-title-dashboard">
          <div className="themes-container">
            <div className="row">
              {!incompleteProfile && (
                <div className="col-lg-12 col-md-12">
                  <div className="title-dashboard">
                    <div className="title-dash flex2">Contractor Dashboard</div>
                  </div>
                </div>
              )}

              {!isLoading && incompleteProfile && (
                <div>
                  <div className="col-lg-12 col-md-12">
                    <div className="title-dashboard">
                      <div className="title-dash flex2">Contractor Dashboard</div>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12 mt-4">
                    <div className="alert-danger alert-style">
                      <p
                        style={{
                          fontSize: "18px",
                          color: "#dc3545",
                          display: "flex",
                          alignItems: "center",
                          fontWeight: "700",
                        }}
                      >
                        Complete Your Profile to Get Discovered!
                      </p>
                      <div className=" mb-3 wd-form-login margin-null">
                        <button
                          onClick={() => {
                            router.push("/contractor/edit-profile");
                          }}
                          className="bg-danger text-white fw-semibold rounded-2 px-4 py-2"
                        >
                          Edit Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="flat-dashboard-resumes flat-dashboard-setting">
          <div className="themes-container_main">
            {isLoading && (
              <div className="flex59">
                <Loader />
              </div>
            )}
            {!isLoading && (
              <div className="row">
                <div className="col-lg-12 col-md-12 ">
                  <div className="profile-setting bg-white">
                    <div className="border-bt">
                      <div className="author-profile">
                        <div className="wd-file-apply style2">
                          <div className="content">
                            <h3>
                              Welcome{" "}
                              <span style={{ color: "#F47920" }}>
                                {user?.firstName || " "} {user?.lastName || " "}
                              </span>
                            </h3>
                            <p className="text-gray-600 mt-2">
                              We're glad to have you here! Use the dashboard to manage your profile,
                              update your availability, and showcase your skills to potential
                              employers. If you need any help, feel free to reach out.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="author-profile">
                      <div className="wd-file-apply style2">
                        <div className="content mt-4">
                          <h3>Getting Started</h3>
                          <div className="mt-4">
                            <h4 className="mb-2">1. Upload Your Resume</h4>
                            <p className="mb-4">
                              First, upload your resume. Our system will automatically extract your
                              information from your resume to build your user profile. This saves
                              you time and ensures all relevant skills and experience are captured.
                            </p>

                            <h4 className="mb-2">2. Complete Your Profile</h4>
                            <p className="mb-4">
                              Review and edit your profile information extracted from your resume.
                              You can update or add missing details like your hourly rate,
                              availability, work preferences, and additional skills. A complete
                              profile improves your visibility.
                            </p>

                            <h4 className="mb-2">3. Enroll in Courses</h4>
                            <p className="mb-4">
                              Once your profile is complete and your resume is uploaded, you can
                              browse and enroll in available courses. Our courses are designed to
                              enhance your skills and make you more competitive in your field.
                            </p>

                            <h4 className="mb-2">4. Browse Job Posts</h4>
                            <p className="mb-4">
                              Once your profile is complete and your resume is uploaded, you can
                              browse and apply for available job posts.
                            </p>

                            <h4 className="mb-2">5. Offered Contracts</h4>
                            <p className="mb-4">
                              You can view all the contracts you've received from companies. To
                              accept a contract, your e-sign will be required.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
