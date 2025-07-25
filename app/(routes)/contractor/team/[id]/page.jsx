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
      console.log("Fetched team data:::::::::::::::", data);
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

  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return "?";
    const first = firstName ? firstName.charAt(0) : "";
    const last = lastName ? lastName.charAt(0) : "";
    return (first + last).toUpperCase() || "?";
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      accepted: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
      default: "bg-gray-100 text-gray-800 border-gray-200",
    };

    const statusStyle =
      statusStyles[status?.toLowerCase()] || statusStyles.default;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyle}`}
      >
        <span
          className={`w-2 h-2 rounded-full mr-1.5 ${
            status?.toLowerCase() === "pending"
              ? "bg-yellow-400"
              : status?.toLowerCase() === "accepted"
              ? "bg-green-400"
              : status?.toLowerCase() === "rejected"
              ? "bg-red-400"
              : "bg-gray-400"
          }`}
        ></span>
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
      </span>
    );
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
                  <div className="team-header flex items-start gap-6 mb-4">
                    {team?.logoUrl ? (
                      <img
                        src={team.logoUrl || "/placeholder.svg"}
                        alt={`${team.name || "Team"} logo`}
                        className="w-32 h-32 rounded-lg object-cover border border-gray-200"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white border border-gray-200">
                        {getInitials(
                          team?.name?.split(" ")[0],
                          team?.name?.split(" ")[1]
                        )}
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

                  {/* Additional Team Information */}
                  <div className="team-additional-info my-2 p-2 border-t border-gray-200">
                    <h3 className="text-xl font-semibold mb-6">
                      Team Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="info-item p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Team ID
                            </p>
                            <p className="text-sm text-gray-600 font-mono">
                              {team?.id}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="info-item p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Total Members
                            </p>
                            <p className="text-sm text-gray-600">
                              {teamMembers.length} members
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="info-item p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Created At
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatDate(team?.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Team Members Section */}
                  <div className="team-members-section">
                    <h2 className="text-2xl font-semibold mb-6 border-b pb-2">
                      Team Members ({teamMembers.length})
                    </h2>
                    {teamMembers.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teamMembers.map((member) => (
                          <div
                            key={member.id || `member-${Math.random()}`}
                            className="member-card p-6 border rounded-xl hover:shadow-lg transition-all duration-300 bg-white hover:border-blue-300"
                          >
                            <div className="flex items-start gap-4">
                              {/* Member Avatar */}
                              <div className="member-avatar-container flex-shrink-0">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-lg font-bold text-white border-2 border-white shadow-md">
                                  {getInitials(
                                    member.user?.firstName,
                                    member.user?.lastName
                                  )}
                                </div>
                              </div>

                              {/* Member Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="font-semibold text-gray-900 text-lg">
                                    {member.user?.firstName &&
                                    member.user?.lastName
                                      ? `${member.user.firstName} ${member.user.lastName}`
                                      : member.user?.firstName ||
                                        member.user?.lastName ||
                                        "Unknown Member"}
                                  </h3>
                                </div>

                                {/* Status Badge */}
                                <div className="mb-3">
                                  {getStatusBadge(member.isAccepted)}
                                </div>

                                {member.user?.email && (
                                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                      />
                                    </svg>
                                    <span className="truncate">
                                      {member.user.email}
                                    </span>
                                  </div>
                                )}

                                {member.joinedAt && (
                                  <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                      />
                                    </svg>
                                    <span>
                                      Joined {formatDate(member.joinedAt)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Empty State */
                      <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-10 h-10 text-gray-400"
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
                        <h3 className="text-xl font-medium text-gray-900 mb-3">
                          No Team Members
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                          This team doesn't have any members yet. Invite team
                          members to get started with collaboration.
                        </p>
                      </div>
                    )}
                  </div>
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
