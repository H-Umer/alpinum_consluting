"use client";
import { useState, useEffect } from "react";
import Loader from "@/components/loader/loader";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { FaRegTrashCan } from "react-icons/fa6";

const Teams = () => {
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const token = useSelector((state) => state.currentUser.token);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/team", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const result = await response.json();
        toast.error(result.message || "Oops! Something Went Wrong!");
        return;
      }

      const result = await response.json();

      // Handle the response structure dynamically
      const teamsData = result.teams || result.data || result || [];

      // Sort teams by creation date (newest first)
      const sortedTeams = Array.isArray(teamsData)
        ? teamsData.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        : [];

      setTeams(sortedTeams);
    } catch (err) {
      toast.error(err.message || "Oops! Something Went Wrong!");
      console.error("Error fetching teams:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatMemberName = (member) => {
    if (!member) return "Unknown Member";

    // Handle different possible member structures
    if (member.name) return member.name;
    if (member.user && (member.user.firstName || member.user.lastName)) {
      const firstName = member.user.firstName || "";
      const lastName = member.user.lastName || "";
      return `${firstName} ${lastName}`.trim();
    }
    if (member.user && member.user.email) return member.user.email;
    if (member.email) return member.email;

    return "Unknown Member";
  };

  const getTeamMembers = (team) => {
    if (!team) return [];

    // Handle different possible member array structures
    const members =
      team.members || team.teamMembers || team.NewTeamMembers || [];
    return Array.isArray(members) ? members : [];
  };

  useEffect(() => {
    if (token) {
      fetchTeams();
    }
  }, [token]);

  const handleDeleteTeam = async (teamId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this team?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/team/${teamId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed to delete team.");
        return;
      }

      toast.success(result.message || "Team deleted successfully.");
      setTeams((prev) => prev.filter((team) => team.id !== teamId));
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An error occurred while deleting the team.");
    }
  };

  const TeamCard = ({ team, index }) => {
    const teamMembers = getTeamMembers(team);

    return (
      <div
        key={team.id || index}
        className="wd-cv-template cl4"
        style={{
          marginBottom: "20px",
          padding: "20px",
          border: "1px solid #e4e4e4",
          borderRadius: "8px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        <div className="content">
          <div
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "flex-start",
            }}
          >
            {/* Team Logo */}
            {team.logoUrl && (
              <img
                src={team.logoUrl || "/placeholder.svg"}
                alt={`${team.name || "Team"} Logo`}
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "8px",
                  objectFit: "cover",
                  border: "1px solid #e4e4e4",
                }}
                onError={(e) => {
                  e.target.src = "/placeholder.svg";
                }}
              />
            )}

            {/* Team Details */}
            <div style={{ flex: 1 }}>
              {/* Team Name and Project Type */}
              <div style={{ marginBottom: "10px" }}>
                <h4
                  onClick={() => router.push(`/company/find-teams/${team.id}`)}
                  style={{
                    margin: "0 0 5px 0",
                    fontSize: "1.2em",
                    fontWeight: "600",
                    color: "#333",
                    cursor: "pointer",
                  }}
                >
                  {team.name || "Unnamed Team"}
                </h4>
                {team.projectType && (
                  <span
                    style={{
                      fontSize: "0.85em",
                      color: "#0066cc",
                      backgroundColor: "#f0f8ff",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      display: "inline-block",
                    }}
                  >
                    {team.projectType}
                  </span>
                )}
              </div>

              {/* Team Description */}
              {team.description && (
                <p
                  style={{
                    fontSize: "0.95em",
                    color: "#666",
                    marginBottom: "15px",
                    lineHeight: "1.5",
                  }}
                >
                  {team.description}
                </p>
              )}

              {/* Team Members */}
              {teamMembers.length > 0 && (
                <div style={{ marginBottom: "15px" }}>
                  <h5
                    style={{
                      margin: "0 0 10px 0",
                      fontSize: "0.95em",
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    Team Members ({teamMembers.length})
                  </h5>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    {teamMembers.map((member, i) => (
                      <span
                        key={member.id || i}
                        style={{
                          backgroundColor: "#e8f5e8",
                          color: "#2d5a2d",
                          padding: "6px 12px",
                          borderRadius: "15px",
                          fontSize: "0.85em",
                          border: "1px solid #c3e6c3",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                        title={`Email: ${
                          member.email || "N/A"
                        }\nSpecialization: ${member.specialization || "N/A"}`}
                      >
                        {member.imageUrl && (
                          <img
                            src={member.imageUrl || "/placeholder.svg"}
                            alt={formatMemberName(member)}
                            style={{
                              width: "20px",
                              height: "20px",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        )}
                        <span>
                          {formatMemberName(member)}
                          {member.specialization && (
                            <span
                              style={{ fontSize: "0.8em", opacity: "0.8" }}
                            >{` (${member.specialization})`}</span>
                          )}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Team Footer */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px solid #eee",
                  paddingTop: "15px",
                  marginTop: "15px",
                }}
              >
                <div style={{ fontSize: "0.85em", color: "#999" }}>
                  {/* <div>Created: {formatDate(team.createdAt)}</div> */}
                  {team.updatedAt && team.updatedAt !== team.createdAt && (
                    <div>Updated: {formatDate(team.updatedAt)}</div>
                  )}
                </div>
                <button
                  style={{
                    padding: "8px 12px",
                    fontSize: "1.2em",
                    color: "#dc3545",
                    backgroundColor: "transparent",
                    border: "1px solid #dc3545",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onClick={() => handleDeleteTeam(team.id)}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#dc3545";
                    e.target.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#dc3545";
                  }}
                >
                  <FaRegTrashCan />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard__content">
      <section className="page-title-dashboard">
        <div className="themes-container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="title-dashboard">
                <div className="title-dash flex2">Teams</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isLoading && (
        <section className="flat-dashboard-resumes flat-dashboard-setting">
          <div className="themes-container_main">
            <div className="flex59">
              <Loader />
            </div>
          </div>
        </section>
      )}

      {!isLoading && (
        <>
          {teams.length > 0 ? (
            <section className="flat-dashboard-resumes flat-dashboard-setting">
              <div className="themes-container_main">
                <div className="tf-tab">
                  <div className="row">
                    <div className="col-lg-12 col-md-12">
                      <div className="wrap-profile instruction bg-white">
                        <div className="instruction_container flex2 flex46">
                          <div className="group-title md:col-12 col-lg-9">
                            <h3 className="fw-6 color-3">Team Management</h3>
                            <p className="mt-2">
                              Create and manage your teams here. You can create
                              new teams with detailed information and manage
                              team members efficiently. View all your teams and
                              organize your workforce effectively for better
                              project coordination.
                            </p>
                          </div>
                          <div className="moodlePortal2 md:col-12 col-lg-3">
                            <div className="tt-button1 tt-button tt-button2 moodlePortal">
                              <a
                                onClick={() =>
                                  router.push("/company/create-team")
                                }
                              >
                                Create Team
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="profile-setting">
                        <div className="content-tab cv-stc2">
                          <div className="inner">
                            <div className="group-col-1">
                              {teams.map((team, index) => (
                                <TeamCard
                                  key={team.id || index}
                                  team={team}
                                  index={index}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section className="flat-dashboard-resumes flat-dashboard-setting">
              <div className="themes-container_main">
                <div className="tf-tab">
                  <div className="row">
                    <div className="col-lg-12 col-md-12">
                      <div className="wrap-profile instruction bg-white">
                        <div className="instruction_container flex2 flex48">
                          <div className="group-title md:col-12 col-lg-10">
                            <h3 className="fw-6 color-3">Team Section</h3>
                            <p className="mt-2">
                              Create and manage all Teams for your projects.
                              Build your workforce by creating teams and
                              maintain a clear overview of your team structure
                              and project assignments.
                            </p>
                          </div>
                          <div className="action-wrap">
                            <ul className="flex2 gap-2">
                              <div>
                                <li>
                                  <a
                                    className="button-cancel-1 fw-7 remove-file"
                                    onClick={() =>
                                      router.push("/contractor/create-team")
                                    }
                                  >
                                    Create Team
                                  </a>
                                </li>
                              </div>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div
                          className="col-lg-12 col-md-12"
                          style={{ height: "100vh" }}
                        >
                          <div className="profile-setting bg-white">
                            <div className="form-infor-profile warn-item-center">
                              <h3
                                style={{
                                  fontSize: "1.5em",
                                  display: "flex",
                                  marginBottom: "5px",
                                  alignItems: "center",
                                  gap: "10px",
                                }}
                              >
                                <span
                                  style={{
                                    color: "#FFA500",
                                    fontSize: "1.2em",
                                  }}
                                >
                                  ⚠️
                                </span>
                                No Teams Found
                              </h3>
                              <p style={{ color: "#666", marginTop: "10px" }}>
                                Get started by creating your first team to
                                organize your projects and manage your workforce
                                effectively.
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
          )}
        </>
      )}
    </div>
  );
};

export default Teams;
