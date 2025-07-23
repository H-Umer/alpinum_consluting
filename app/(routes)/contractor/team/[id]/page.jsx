"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loader from "@/components/loader/loader";
import { toast } from "react-toastify";

const TeamDetailPage = () => {
  const params = useParams();
  const id = params?.id;
  const token = useSelector((state) => state.currentUser.token);
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTeamDetail = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/team/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch team details");
      }

      const data = await res.json();
      console.log("Fetched team data:", data);
      setTeamData(data);
    } catch (error) {
      console.error("Error fetching team details:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && token) {
      fetchTeamDetail();
    }
  }, [id, token]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!teamData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Team not found.</p>
      </div>
    );
  }

  const { team, teamMembers = [] } = teamData;

  return (
    <div className="dashboard__content">
      <section className="page-title-dashboard">
        <div className="themes-container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="title-dashboard">
                <div className="title-dash flex2">Team Details</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flat-dashboard-resumes flat-dashboard-setting">
        <div className="themes-container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="profile-setting bg-white">
                <div className="wrap-team-detail">
                  {/* Team Header */}
                  <div className="team-header flex items-start gap-6 mb-8">
                    {team?.logoUrl && (
                      <img
                        src={team.logoUrl}
                        alt={`${team.name || "Team"} logo`}
                        className="w-32 h-32 rounded-lg object-cover border border-gray-200"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}

                    {/* Fallback Avatar if no logo */}
                    {!team?.logoUrl && (
                      <div className="w-32 h-32 rounded-lg bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-600 border border-gray-200">
                        {getInitials(team?.name)}
                      </div>
                    )}

                    <div className="team-info flex-1">
                      <h1 className="text-3xl font-bold mb-2">
                        {team?.name || "Unnamed Team"}
                      </h1>

                      {team?.projectType && (
                        <div className="badge bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm inline-block mb-4">
                          {team.projectType}
                        </div>
                      )}

                      {team?.description && (
                        <p className="text-gray-600 mb-4">{team.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Team Members Section */}
                  <div className="team-members-section">
                    <h2 className="text-2xl font-semibold mb-6 border-b pb-2">
                      Team Members ({teamMembers.length})
                    </h2>

                    {teamMembers.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {teamMembers.map((member) => (
                          <div
                            key={member.id || `member-${Math.random()}`}
                            className="member-card p-4 border rounded-lg hover:shadow-md transition-shadow bg-white"
                          >
                            <div className="flex items-start gap-4">
                              {/* Member Avatar */}
                              <div className="member-avatar-container flex-shrink-0">
                                {member.imageUrl ? (
                                  <img
                                    src={member.imageUrl}
                                    alt={member.name || "Member"}
                                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                      e.target.nextSibling.style.display =
                                        "flex";
                                    }}
                                  />
                                ) : (
                                  <div
                                    className={`w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-600 ${
                                      member.imageUrl ? "hidden" : "flex"
                                    }`}
                                  >
                                    {getInitials(member.name)}
                                  </div>
                                )}
                              </div>

                              {/* Member Info */}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 mb-1">
                                  {member.name || "Unknown Member"}
                                </h3>

                                {member.specialization && (
                                  <p className="text-sm text-blue-600 font-medium mb-2">
                                    {member.specialization}
                                  </p>
                                )}

                                {member.email && (
                                  <p className="text-sm text-gray-600 mb-1 truncate">
                                    📧 {member.email}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Empty State */
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No Team Members
                        </h3>
                        <p className="text-gray-500">
                          This team doesn't have any members yet.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Additional Team Information */}
                  {(team?.teamId || Object.keys(team || {}).length > 0) && (
                    <div className="team-additional-info mt-8 pt-6 border-t">
                      <h3 className="text-lg font-semibold mb-4">
                        Additional Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {team?.teamId && (
                          <div>
                            <span className="font-medium text-gray-700">
                              Team Reference ID:
                            </span>
                            <span className="ml-2 text-gray-600">
                              {team.teamId}
                            </span>
                          </div>
                        )}

                        <div>
                          <span className="font-medium text-gray-700">
                            Total Members:
                          </span>
                          <span className="ml-2 text-gray-600">
                            {teamMembers.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeamDetailPage;
