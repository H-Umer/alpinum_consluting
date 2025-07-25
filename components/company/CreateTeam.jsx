"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Select from "react-select";
import { useSelector } from "react-redux";
import { fetchContractors } from "@/utils/fetchAllContractors";

export default function CreateTeam() {
  const router = useRouter();
  const token = useSelector((state) => state.currentUser.token);
  const [teamInfo, setTeamInfo] = useState({
    name: "",
    description: "",
    projectType: "",
    members: [], // This will store user objects with value and label
  });
  const [teamImage, setTeamImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);

  // Manual team member entry
  const [currentMember, setCurrentMember] = useState({
    name: "",
    specialization: "",
    email: "",
  });

  // Fetch available team members
  useEffect(() => {
    if (token) {
      fetchContractors(token)
        .then((data) => {
          setTeamMembers(data);
        })
        .catch((error) => {
          console.error("Error fetching contractors:", error.message);
          toast.error("Failed to fetch team members");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB!");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file!");
      return;
    }

    setTeamImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setTeamImage(null);
    setPreviewUrl(null);
    const fileInput = document.getElementById("team-image-input");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleMembersChange = (selectedOptions) => {
    setTeamInfo((prev) => ({
      ...prev,
      members: selectedOptions || [],
    }));
  };

  // Professional default team icon component
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!teamInfo.name.trim()) {
      return toast.error("Team name is required!");
    }
    if (!teamInfo.description.trim()) {
      return toast.error("Description is required!");
    }
    if (!teamInfo.projectType) {
      return toast.error("Project type is required!");
    }
    if (teamInfo.members.length === 0) {
      return toast.error("Add at least one team member!");
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      // Prepare all members data
      const allMembers = [
        ...teamInfo.members.map((member) => ({
          contractorId: member.value,
          type: "existing",
        })),
      ];

      const payload = {
        name: teamInfo.name,
        description: teamInfo.description,
        projectType: teamInfo.projectType,
        members: allMembers, // Send both types of members
      };

      formData.append("teamData", JSON.stringify(payload));

      if (teamImage) {
        formData.append("teamImage", teamImage);
      }

      const res = await fetch("/api/team", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.status !== 201) {
        throw new Error(data.error || "Something went wrong");
      }

      router.push("/company/find-teams");
      toast.success("Team created successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to create team");
    } finally {
      setIsLoading(false);
    }
  };

  const DefaultTeamIcon = () => (
    <div
      style={{
        width: "120px",
        height: "120px",
        backgroundColor: "#f8f9fa",
        border: "2px dashed #dee2e6",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#6c757d",
        fontSize: "12px",
        textAlign: "center",
        padding: "10px",
      }}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ marginBottom: "8px" }}
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
      <span style={{ fontSize: "11px", fontWeight: "500" }}>Team Logo</span>
    </div>
  );

  return (
    <div className="dashboard__content">
      <section className="page-title-dashboard">
        <div className="themes-container">
          <div className="row">
            <div className="col-lg-12">
              <div className="title-dashboard">
                <div className="title-dash flex2">Create New Team</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flat-dashboard-setting flat-dashboard-setting2">
        <div className="themes-container">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-12">
                <div className="profile-setting bg-white">
                  <div className="form-infor-profile">
                    <h3 className="title-info">Team Information</h3>

                    {/* Image Upload */}
                    <div className="profile-image-upload mb-4">
                      <div className="d-flex align-items-center gap-3">
                        {previewUrl ? (
                          <div style={{ position: "relative" }}>
                            <img
                              alt="Team Logo"
                              src={previewUrl || "/placeholder.svg"}
                              width={120}
                              height={120}
                              style={{
                                objectFit: "cover",
                                border: "1px solid #e4e4e4",
                                borderRadius: "8px",
                              }}
                            />
                          </div>
                        ) : (
                          <DefaultTeamIcon />
                        )}
                        <div className="upload-controls">
                          <label className="title-user fw-7">Team Logo</label>
                          <div className="mt-2">
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/jpg"
                              id="team-image-input"
                              style={{ display: "none" }}
                              onChange={handleImageChange}
                            />
                            <label
                              htmlFor="team-image-input"
                              style={{
                                padding: "10px 16px",
                                backgroundColor: "#f47920",
                                color: "white",
                                borderRadius: "4px",
                                fontWeight: "600",
                                fontSize: "14px",
                                cursor: "pointer",
                                display: "inline-block",
                                transition: "background-color 0.2s",
                              }}
                              onMouseOver={(e) => {
                                e.target.style.backgroundColor = "#e06a1a";
                              }}
                              onMouseOut={(e) => {
                                e.target.style.backgroundColor = "#f47920";
                              }}
                            >
                              {previewUrl ? "Change Image" : "Choose Image"}
                            </label>
                            {previewUrl && (
                              <button
                                type="button"
                                onClick={handleRemoveImage}
                                style={{
                                  padding: "10px 16px",
                                  backgroundColor: "#6c757d",
                                  color: "white",
                                  borderRadius: "4px",
                                  fontWeight: "600",
                                  fontSize: "14px",
                                  cursor: "pointer",
                                  display: "inline-block",
                                  marginLeft: "10px",
                                  border: "none",
                                }}
                              >
                                Remove
                              </button>
                            )}
                            <small className="d-block mt-2 text-muted">
                              Max 5MB. Formats: JPG, PNG
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Basic Team Info */}
                    <div className="form-infor flex flat-form">
                      <div className="info-box info-wd">
                        <fieldset>
                          <label className="title-user fw-7">Team Name *</label>
                          <input
                            type="text"
                            className="input-form2"
                            placeholder="Enter team name"
                            value={teamInfo.name}
                            onChange={(e) =>
                              setTeamInfo((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                          />
                        </fieldset>

                        {/* <fieldset>
                          <label className="title-user fw-7">
                            Project Type *
                          </label>
                          <Select
                            name="projectType"
                            options={projectTypeOptions}
                            classNamePrefix="select"
                            placeholder="Select type"
                            value={projectTypeOptions.find(
                              (opt) => opt.value === teamInfo.projectType
                            )}
                            onChange={(option) =>
                              setTeamInfo((prev) => ({
                                ...prev,
                                projectType: option?.value || "",
                              }))
                            }
                          />
                        </fieldset> */}
                        <fieldset>
                          <label className="title-user fw-7">
                            Project Type *
                          </label>
                          <input
                            type="text"
                            className="input-form2"
                            placeholder="Enter project type"
                            value={teamInfo.projectType}
                            onChange={(e) =>
                              setTeamInfo((prev) => ({
                                ...prev,
                                projectType: e.target.value,
                              }))
                            }
                          />
                        </fieldset>
                      </div>

                      <div className="info-box info-wd">
                        <fieldset>
                          <label className="title-user fw-7">
                            Team Description *
                          </label>
                          <textarea
                            className="input-form2"
                            placeholder="Describe your team and project"
                            rows={4}
                            value={teamInfo.description}
                            onChange={(e) =>
                              setTeamInfo((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                          />
                        </fieldset>
                      </div>
                    </div>

                    {/* Team Members Section */}
                    <div className="mt-4">
                      <h4 className="title-info mb-3">Team Members</h4>

                      {/* Existing Contractors */}
                      <div className="mb-4">
                        <fieldset>
                          <label className="title-user fw-7">
                            Select from Existing Contractors
                          </label>
                          <Select
                            isMulti
                            name="members"
                            options={teamMembers}
                            classNamePrefix="select"
                            placeholder="Select existing contractors"
                            value={teamInfo.members}
                            onChange={handleMembersChange}
                            isLoading={isLoading && teamMembers.length === 0}
                            loadingMessage={() => "Loading contractors..."}
                          />
                        </fieldset>
                      </div>
                    </div>
                  </div>

                  <div className="w-100 d-flex justify-content-end">
                    <div className="row mt-1 gap-3 wd-form-login wd-form-loginleft">
                      <button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <span>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Creating Team...
                          </span>
                        ) : (
                          "Create Team"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
