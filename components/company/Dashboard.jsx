"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const user = useSelector((state) => state.currentUser.user);
  const router = useRouter();

  useEffect(() => {
    if (user.role !== "COMPANY") {
      router.replace("/contractor/dashboard");
    }
  }, [user]);

  return (
    <>
      <div className="dashboard__content">
        <section className="page-title-dashboard">
          <div className="themes-container">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="title-dashboard">
                  <div className="title-dash flex2">Company Dashboard</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flat-dashboard-resumes flat-dashboard-setting">
          <div className="themes-container_main">
            <div className="row">
              <div className="col-lg-12 col-md-12 ">
                <div className="profile-setting bg-white">
                  <div className="border-bt">
                    <div className="author-profile">
                      <div className="wd-file-apply style2">
                        <div className="content">
                          <h3>
                            Welcome{" "}
                            <span style={{ color: "#F47920" }}>{user?.companyName || " "}</span>
                          </h3>
                          <p className="text-gray-600 mt-2">
                            Connect with skilled contractors and find the perfect match for your
                            projects. Complete your company profile to start engaging with potential
                            contractors and schedule meetings.
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
                          <h4 className="mb-2">1. Complete Company Profile</h4>
                          <p className="mb-4">
                            Start by completing your company profile. Add your company description,
                            industry focus, and the types of skills you're looking for. A detailed
                            profile helps contractors understand your needs better.
                          </p>

                          <h4 className="mb-2">2. Browse Contractor Profiles</h4>
                          <p className="mb-4">
                            Once your profile is complete, you'll gain access to our contractor
                            database. Browse through profiles, view resumes, and filter by skills,
                            experience, and availability to find the perfect match for your
                            projects.
                          </p>

                          <h4 className="mb-2">3. Schedule Meetings</h4>
                          <p className="mb-4">
                            Found a promising contractor? Send them a meeting invitation through our
                            platform. You can discuss project details, requirements, and determine
                            if there's a good fit for collaboration.
                          </p>

                          <h4 className="mb-2">4. Offer Contract</h4>
                          <p className="mb-4">
                            You can search for a contractor from the list of contractors. Once
                            you've found the perfect contractor, you can offer them a contract.
                          </p>

                          <h4 className="mb-2">5. Manage Contracts</h4>
                          <p className="mb-4">
                            Once a contractor accepts your offer, you can view the contract and
                            manage it. You can also view the status of the contracts and manage
                            them.
                          </p>

                          <h4 className="mb-2">6. Create Job Post</h4>
                          <p className="mb-4">
                            Create a job post with detailed requirements and experience levels to
                            hire a contractor.
                          </p>

                          <h4 className="mb-2">7. Manage Job Posts</h4>
                          <p className="mb-4">
                            You can view all the job posts you've created and manage them. You can
                            also edit and delete the job post.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Dashboard;
