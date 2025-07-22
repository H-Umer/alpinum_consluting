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

  const { team, teamMembers } = teamData;
  const manualMembers = team.NewTeamMembers || [];

  // Combine both types of members for display
  const allMembers = [
    ...teamMembers.map((member) => ({
      id: member.id,
      type: "existing",
      name: `${member.user.firstName} ${member.user.lastName}`,
      email: member.user.email,
      specialization:
        member.user.contractorProfile?.designation || "Contractor",
      joinedAt: member.joinedAt,
    })),
    ...manualMembers.map((member, index) => ({
      id: `manual-${index}`,
      type: "manual",
      name: member.name,
      email: member.email,
      specialization: member.specialization,
      joinedAt: team.createdAt,
    })),
  ];

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
                    {team.logoUrl && (
                      <img
                        src={team.logoUrl}
                        alt={`${team.name} logo`}
                        className="w-32 h-32 rounded-lg object-cover border border-gray-200"
                      />
                    )}
                    <div className="team-info flex-1">
                      <h1 className="text-3xl font-bold mb-2">{team.name}</h1>
                      <div className="badge bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm inline-block mb-4">
                        {team.projectType}
                      </div>
                      <p className="text-gray-600 mb-4">{team.description}</p>
                      <div className="text-sm text-gray-500">
                        Created: {new Date(team.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Team Members */}
                  <div className="team-members-section">
                    <h2 className="text-2xl font-semibold mb-6 border-b pb-2">
                      Team Members ({allMembers.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {allMembers.map((member) => (
                        <div
                          key={member.id}
                          className={`member-card p-4 border rounded-lg hover:shadow-md transition-shadow ${
                            member.type === "manual" ? "bg-gray-50" : ""
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="member-avatar w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-medium">
                                {member.name}
                                {member.type === "manual" && (
                                  <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                                    External
                                  </span>
                                )}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {member.specialization}
                              </p>
                              {member.email && (
                                <p className="text-sm text-gray-500">
                                  {member.email}
                                </p>
                              )}
                              <p className="text-xs text-gray-400 mt-1">
                                Joined:{" "}
                                {new Date(member.joinedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
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
