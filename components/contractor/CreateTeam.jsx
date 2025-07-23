"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function CreateTeam() {
  const router = useRouter();
  const token = useSelector((state) => state.currentUser.token);

  const [teamInfo, setTeamInfo] = useState({
    name: "",
    description: "",
  });

  const [teamImage, setTeamImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]); // For existing users from select
  const [manualMembers, setManualMembers] = useState([]); // For manually added members

  // Manual team member entry
  const [currentMember, setCurrentMember] = useState({
    name: "",
    specialization: "",
    email: "",
    image: null,
    imagePreview: null,
  });

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

  // Handle member image change
  const handleMemberImageChange = (e) => {
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

    const reader = new FileReader();
    reader.onloadend = () => {
      setCurrentMember((prev) => ({
        ...prev,
        image: file,
        imagePreview: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Handle manual member removal
  const handleRemoveManualMember = (memberId) => {
    setManualMembers((prev) => prev.filter((member) => member.id !== memberId));
  };

  // Add manual member function
  const handleAddManualMember = () => {
    // Validation
    if (!currentMember.name.trim()) {
      return toast.error("Member name is required!");
    }
    if (!currentMember.specialization.trim()) {
      return toast.error("Specialization is required!");
    }

    // Add new member with unique ID
    const newMember = {
      id: Date.now().toString(),
      name: currentMember.name,
      specialization: currentMember.specialization,
      email: currentMember.email,
      image: currentMember.image,
      imagePreview: currentMember.imagePreview,
    };

    setManualMembers((prev) => [...prev, newMember]);

    // Reset form
    setCurrentMember({
      name: "",
      specialization: "",
      email: "",
      image: null,
      imagePreview: null,
    });

    // Reset file input
    const fileInput = document.getElementById("member-image-input");
    if (fileInput) {
      fileInput.value = "";
    }

    // toast.success("Team member added successfully!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!teamInfo.name.trim()) {
      return toast.error("Team name is required!");
    }
    if (!teamInfo.description.trim()) {
      return toast.error("Description is required!");
    }
    if (teamMembers.length === 0 && manualMembers.length === 0) {
      return toast.error("Add at least one team member!");
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      // Combine both types of members
      const allMembers = [
        // ...teamMembers.map((member) => ({
        //   name: member.label,
        //   email: member.label,
        // })),
        ...manualMembers.map((member) => ({
          ...member,
        })),
      ];

      const payload = {
        name: teamInfo.name,
        description: teamInfo.description,
        members: allMembers,
      };

      formData.append("teamData", JSON.stringify(payload));

      // Add team image if exists
      if (teamImage) {
        formData.append("teamImage", teamImage);
      }

      // Add member images if they exist
      manualMembers.forEach((member) => {
        if (member.image) {
          formData.append(`memberImage_${member.id}`, member.image);
        }
      });

      console.log("formDataformDataformData", formData);

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

      router.push("/contractor/team");
      toast.success("Team created successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to create team");
    } finally {
      setIsLoading(false);
    }
  };

  // Professional default team icon component
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

  // Default member icon component
  const DefaultMemberIcon = () => (
    <div
      style={{
        width: "80px",
        height: "80px",
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
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ marginBottom: "8px" }}
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
      <span style={{ fontSize: "10px", fontWeight: "500" }}>Member Photo</span>
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
                      </div>
                    </div>

                    <div className="form-infor flex flat-form">
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
                      <h3 className="title-info">Add New Team Members</h3>

                      {/* Manual Member Entry */}
                      <div className="mb-4">
                        <div className="form-infor flex flat-form">
                          <div className="info-box info-wd">
                            <fieldset>
                              <label className="title-user fw-7">
                                Member Name *
                              </label>
                              <input
                                type="text"
                                className="input-form2"
                                placeholder="Enter member name"
                                value={currentMember.name}
                                onChange={(e) =>
                                  setCurrentMember((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                  }))
                                }
                              />
                            </fieldset>
                            <fieldset>
                              <label className="title-user fw-7">
                                Specialization *
                              </label>
                              <input
                                type="text"
                                className="input-form2"
                                placeholder="Enter specialization"
                                value={currentMember.specialization}
                                onChange={(e) =>
                                  setCurrentMember((prev) => ({
                                    ...prev,
                                    specialization: e.target.value,
                                  }))
                                }
                              />
                            </fieldset>
                          </div>
                          <div className="info-box info-wd">
                            <fieldset>
                              <label className="title-user fw-7">
                                Email (Optional)
                              </label>
                              <input
                                type="email"
                                className="input-form2"
                                placeholder="Enter email address"
                                value={currentMember.email}
                                onChange={(e) =>
                                  setCurrentMember((prev) => ({
                                    ...prev,
                                    email: e.target.value,
                                  }))
                                }
                              />
                            </fieldset>

                            {/* Member Image Upload */}
                            <fieldset>
                              <label className="title-user fw-7">
                                Member Photo (Optional)
                              </label>
                              <div className="d-flex align-items-center gap-3 mt-2">
                                {currentMember.imagePreview ? (
                                  <div style={{ position: "relative" }}>
                                    <img
                                      alt="Member Photo"
                                      src={
                                        currentMember.imagePreview ||
                                        "/placeholder.svg"
                                      }
                                      width={80}
                                      height={80}
                                      style={{
                                        objectFit: "cover",
                                        border: "1px solid #e4e4e4",
                                        borderRadius: "8px",
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <DefaultMemberIcon />
                                )}
                                <div>
                                  <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg"
                                    id="member-image-input"
                                    style={{ display: "none" }}
                                    onChange={handleMemberImageChange}
                                  />
                                  <label
                                    htmlFor="member-image-input"
                                    style={{
                                      padding: "8px 12px",
                                      backgroundColor: "#f47920",
                                      color: "white",
                                      borderRadius: "4px",
                                      fontWeight: "600",
                                      fontSize: "14px",
                                      cursor: "pointer",
                                      display: "inline-block",
                                      transition: "background-color 0.2s",
                                    }}
                                  >
                                    {currentMember.imagePreview
                                      ? "Change Photo"
                                      : "Choose Photo"}
                                  </label>
                                  {currentMember.imagePreview && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setCurrentMember((prev) => ({
                                          ...prev,
                                          image: null,
                                          imagePreview: null,
                                        }));
                                        const fileInput =
                                          document.getElementById(
                                            "member-image-input"
                                          );
                                        if (fileInput) {
                                          fileInput.value = "";
                                        }
                                      }}
                                      style={{
                                        padding: "8px 12px",
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
                                </div>
                              </div>
                            </fieldset>

                            <div className="mt-3">
                              <button
                                type="button"
                                onClick={handleAddManualMember}
                                style={{
                                  padding: "10px 20px",
                                  backgroundColor: "#f47920",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "4px",
                                  fontWeight: "600",
                                  cursor: "pointer",
                                }}
                              >
                                Add Member
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Display Added Manual Members */}
                      {manualMembers.length > 0 && (
                        <div className="mb-4">
                          <h6 className="title-user fw-7 mb-3">
                            Added Team Members
                          </h6>
                          <div className="row">
                            {manualMembers.map((member) => (
                              <div key={member.id} className="col-md-6 mb-3">
                                <div
                                  style={{
                                    border: "1px solid #dee2e6",
                                    borderRadius: "8px",
                                    padding: "15px",
                                    backgroundColor: "#f8f9fa",
                                  }}
                                >
                                  <div className="d-flex justify-content-between align-items-start">
                                    <div className="d-flex gap-3">
                                      {member.imagePreview ? (
                                        <img
                                          src={
                                            member.imagePreview ||
                                            "/placeholder.svg"
                                          }
                                          alt={member.name}
                                          style={{
                                            width: "60px",
                                            height: "60px",
                                            borderRadius: "8px",
                                            objectFit: "cover",
                                          }}
                                        />
                                      ) : (
                                        <div
                                          style={{
                                            width: "60px",
                                            height: "60px",
                                            backgroundColor: "#e9ecef",
                                            borderRadius: "8px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                          }}
                                        >
                                          <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          >
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                          </svg>
                                        </div>
                                      )}
                                      <div>
                                        <h6 className="mb-1 fw-bold">
                                          {member.name}
                                        </h6>
                                        <p className="mb-1 text-muted small">
                                          {member.specialization}
                                        </p>
                                        {member.email && (
                                          <p className="mb-0 text-muted small">
                                            {member.email}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleRemoveManualMember(member.id)
                                      }
                                      style={{
                                        background: "none",
                                        border: "none",
                                        color: "#dc3545",
                                        cursor: "pointer",
                                        fontSize: "18px",
                                      }}
                                      title="Remove member"
                                    >
                                      ×
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
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
