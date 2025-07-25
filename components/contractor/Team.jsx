// "use client";
// import { useState, useEffect } from "react";
// import Loader from "@/components/loader/loader";
// import { toast } from "react-toastify";
// import { useSelector } from "react-redux";
// import { useRouter } from "next/navigation";

// const Teams = () => {
//   const router = useRouter();
//   const [teams, setTeams] = useState([]);
//   const token = useSelector((state) => state.currentUser.token);
//   const [isLoading, setIsLoading] = useState(false);
//   const [updatingStatus, setUpdatingStatus] = useState({});

//   // Invitation Status Enum
//   const InvitationStatus = {
//     PENDING: "pending",
//     ACCEPTED: "accepted",
//     REJECTED: "rejected",
//   };

//   const fetchTeams = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch("/api/contractor-teams", {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       if (!response.ok) {
//         const result = await response.json();
//         toast.error(result.message || "Oops! Something Went Wrong!");
//         return;
//       }
//       const result = await response.json();
//       console.log("API Response:", result);

//       const teamsData = result.teams || result.data || result || [];
//       const sortedTeams = Array.isArray(teamsData)
//         ? teamsData.sort((a, b) => {
//             const dateA = new Date(a.team?.createdAt || a.createdAt || 0);
//             const dateB = new Date(b.team?.createdAt || b.createdAt || 0);
//             return dateB - dateA;
//           })
//         : [];
//       setTeams(sortedTeams);
//     } catch (err) {
//       toast.error(err.message || "Oops! Something Went Wrong!");
//       console.error("Error fetching teams:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const updateInvitationStatus = async (teamId, status) => {
//     const statusKey = `${teamId}-${status}`;
//     setUpdatingStatus((prev) => ({ ...prev, [statusKey]: true }));

//     try {
//       const response = await fetch("/api/contractor-teams/update-status", {
//         method: "PATCH",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           teamId,
//           status,
//         }),
//       });

//       if (!response.ok) {
//         const result = await response.json();
//         toast.error(result.message || "Failed to update status!");
//         return;
//       }

//       const result = await response.json();
//       console.log("resultresultttttttttttt", result);
//       toast.success(`Invitation ${status} successfully!`);

//       // Update the local state
//       setTeams((prevTeams) =>
//         prevTeams.map((teamItem) => {
//           const teamData = getTeamData(teamItem);
//           if (teamData.id === teamId || teamData.teamId === teamId) {
//             return { ...teamItem, isAccepted: status };
//           }
//           return teamItem;
//         })
//       );
//     } catch (err) {
//       toast.error(err.message || "Failed to update status!");
//       console.error("Error updating status:", err);
//     } finally {
//       setUpdatingStatus((prev) => ({ ...prev, [statusKey]: false }));
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const formatMemberName = (member) => {
//     if (!member) return "Unknown Member";
//     const user = member.user || member;
//     if (user.firstName || user.lastName) {
//       const firstName = user.firstName || "";
//       const lastName = user.lastName || "";
//       return `${firstName} ${lastName}`.trim();
//     }
//     if (user.name) return user.name;
//     if (user.email) return user.email;
//     if (member.email) return member.email;
//     return "Unknown Member";
//   };

//   const getTeamData = (teamItem) => {
//     return teamItem.team || teamItem;
//   };

//   const getUserData = (teamItem) => {
//     return teamItem.user || teamItem;
//   };

//   const getTeamMembers = (teamItem) => {
//     const teamData = getTeamData(teamItem);
//     const userData = getUserData(teamItem);
//     const members = [];

//     if (
//       userData &&
//       (userData.firstName || userData.lastName || userData.email)
//     ) {
//       members.push({
//         id: userData.id || userData.userId,
//         name: formatMemberName({ user: userData }),
//         email: userData.email,

//         isAccepted: teamItem.isAccepted,
//         joinedAt: teamItem.joinedAt,
//       });
//     }

//     if (teamData.members && Array.isArray(teamData.members)) {
//       teamData.members.forEach((member) => {
//         members.push({
//           id: member.id,
//           name: formatMemberName(member),
//           email: member.email,

//           specialization: member.specialization,
//         });
//       });
//     }

//     return members;
//   };

//   const getStatusBadgeStyle = (status) => {
//     const baseStyle = {
//       fontSize: "0.75em",
//       padding: "4px 8px",
//       borderRadius: "12px",
//       display: "inline-block",
//       marginRight: "10px",
//       fontWeight: "500",
//       textTransform: "capitalize",
//     };

//     switch (status) {
//       case InvitationStatus.ACCEPTED:
//         return {
//           ...baseStyle,
//           color: "#28a745",
//           backgroundColor: "#d4edda",
//           border: "1px solid #c3e6cb",
//         };
//       case InvitationStatus.REJECTED:
//         return {
//           ...baseStyle,
//           color: "#dc3545",
//           backgroundColor: "#f8d7da",
//           border: "1px solid #f5c6cb",
//         };
//       case InvitationStatus.PENDING:
//       default:
//         return {
//           ...baseStyle,
//           color: "#856404",
//           backgroundColor: "#fff3cd",
//           border: "1px solid #ffeaa7",
//         };
//     }
//   };

//   const renderActionButtons = (teamItem) => {
//     const teamData = getTeamData(teamItem);
//     const teamId = teamData.id || teamData.teamId;
//     const currentStatus = teamItem.isAccepted;

//     if (
//       currentStatus === InvitationStatus.ACCEPTED ||
//       currentStatus === InvitationStatus.REJECTED
//     ) {
//       return null;
//     }

//     return (
//       <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
//         <button
//           onClick={() =>
//             updateInvitationStatus(teamId, InvitationStatus.ACCEPTED)
//           }
//           disabled={updatingStatus[`${teamId}-${InvitationStatus.ACCEPTED}`]}
//           style={{
//             backgroundColor: "#28a745",
//             color: "white",
//             border: "none",
//             padding: "8px 16px",
//             borderRadius: "6px",
//             fontSize: "0.85em",
//             fontWeight: "500",
//             cursor: updatingStatus[`${teamId}-${InvitationStatus.ACCEPTED}`]
//               ? "not-allowed"
//               : "pointer",
//             opacity: updatingStatus[`${teamId}-${InvitationStatus.ACCEPTED}`]
//               ? 0.7
//               : 1,
//             display: "flex",
//             alignItems: "center",
//             gap: "5px",
//             transition: "all 0.2s ease",
//           }}
//           onMouseOver={(e) => {
//             if (!updatingStatus[`${teamId}-${InvitationStatus.ACCEPTED}`]) {
//               e.target.style.backgroundColor = "#218838";
//             }
//           }}
//           onMouseOut={(e) => {
//             if (!updatingStatus[`${teamId}-${InvitationStatus.ACCEPTED}`]) {
//               e.target.style.backgroundColor = "#28a745";
//             }
//           }}
//         >
//           {updatingStatus[`${teamId}-${InvitationStatus.ACCEPTED}`] ? (
//             <>
//               <span
//                 style={{
//                   width: "12px",
//                   height: "12px",
//                   border: "2px solid #ffffff",
//                   borderTop: "2px solid transparent",
//                   borderRadius: "50%",
//                   animation: "spin 1s linear infinite",
//                 }}
//               ></span>
//               Accepting...
//             </>
//           ) : (
//             <>✓ Accept</>
//           )}
//         </button>

//         <button
//           onClick={() =>
//             updateInvitationStatus(teamId, InvitationStatus.REJECTED)
//           }
//           disabled={updatingStatus[`${teamId}-${InvitationStatus.REJECTED}`]}
//           style={{
//             backgroundColor: "#dc3545",
//             color: "white",
//             border: "none",
//             padding: "8px 16px",
//             borderRadius: "6px",
//             fontSize: "0.85em",
//             fontWeight: "500",
//             cursor: updatingStatus[`${teamId}-${InvitationStatus.REJECTED}`]
//               ? "not-allowed"
//               : "pointer",
//             opacity: updatingStatus[`${teamId}-${InvitationStatus.REJECTED}`]
//               ? 0.7
//               : 1,
//             display: "flex",
//             alignItems: "center",
//             gap: "5px",
//             transition: "all 0.2s ease",
//           }}
//           onMouseOver={(e) => {
//             if (!updatingStatus[`${teamId}-${InvitationStatus.REJECTED}`]) {
//               e.target.style.backgroundColor = "#c82333";
//             }
//           }}
//           onMouseOut={(e) => {
//             if (!updatingStatus[`${teamId}-${InvitationStatus.REJECTED}`]) {
//               e.target.style.backgroundColor = "#dc3545";
//             }
//           }}
//         >
//           {updatingStatus[`${teamId}-${InvitationStatus.REJECTED}`] ? (
//             <>
//               <span
//                 style={{
//                   width: "12px",
//                   height: "12px",
//                   border: "2px solid #ffffff",
//                   borderTop: "2px solid transparent",
//                   borderRadius: "50%",
//                   animation: "spin 1s linear infinite",
//                 }}
//               ></span>
//               declining...
//             </>
//           ) : (
//             <>✗ Decline</>
//           )}
//         </button>
//       </div>
//     );
//   };

//   useEffect(() => {
//     if (token) {
//       fetchTeams();
//     }
//   }, [token]);

//   const TeamCard = ({ teamItem, index }) => {
//     const teamData = getTeamData(teamItem);
//     const userData = getUserData(teamItem);
//     const teamMembers = getTeamMembers(teamItem);

//     return (
//       <div
//         key={teamData.id || teamData.teamId || index}
//         className="wd-cv-template cl4"
//         style={{
//           marginBottom: "20px",
//           padding: "20px",
//           border: "1px solid #e4e4e4",
//           borderRadius: "8px",
//           backgroundColor: "#fff",
//           boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
//         }}
//       >
//         <div className="content">
//           <div
//             style={{
//               display: "flex",
//               gap: "20px",
//               alignItems: "flex-start",
//             }}
//           >
//             {/* Team Logo */}
//             {teamData.logoUrl && (
//               <img
//                 src={teamData.logoUrl || "/placeholder.svg"}
//                 alt={`${teamData.name || "Team"} Logo`}
//                 style={{
//                   width: "100px",
//                   height: "100px",
//                   borderRadius: "8px",
//                   objectFit: "cover",
//                   border: "1px solid #e4e4e4",
//                 }}
//                 onError={(e) => {
//                   e.target.src = "/placeholder.svg";
//                 }}
//               />
//             )}

//             {/* Team Details */}
//             <div style={{ flex: 1 }}>
//               {/* Team Name and Project Type */}
//               <div style={{ marginBottom: "10px" }}>
//                 <h4
//                   onClick={() =>
//                     router.push(
//                       `/company/find-teams/${teamData.id || teamData.teamId}`
//                     )
//                   }
//                   style={{
//                     margin: "0 0 5px 0",
//                     fontSize: "1.2em",
//                     fontWeight: "600",
//                     color: "#333",
//                     cursor: "pointer",
//                   }}
//                 >
//                   {teamData.name || "Unnamed Team"}
//                 </h4>

//                 {teamData.projectType && (
//                   <span
//                     style={{
//                       fontSize: "0.85em",
//                       color: "#0066cc",
//                       backgroundColor: "#f0f8ff",
//                       padding: "4px 10px",
//                       borderRadius: "12px",
//                       display: "inline-block",
//                     }}
//                   >
//                     {teamData.projectType}
//                   </span>
//                 )}
//               </div>

//               {/* Team Description */}
//               {teamData.description && (
//                 <p
//                   style={{
//                     fontSize: "0.95em",
//                     color: "#666",
//                     marginBottom: "15px",
//                     lineHeight: "1.5",
//                   }}
//                 >
//                   {teamData.description}
//                 </p>
//               )}

//               {/* Status Badge */}
//               {teamItem.isAccepted && (
//                 <span style={getStatusBadgeStyle(teamItem.isAccepted)}>
//                   {teamItem.isAccepted}
//                 </span>
//               )}

//               {/* Action Buttons */}
//               {renderActionButtons(teamItem)}

//               {/* Team Footer */}
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   borderTop: "1px solid #eee",
//                   paddingTop: "15px",
//                   marginTop: "15px",
//                 }}
//               >
//                 <div style={{ fontSize: "0.85em", color: "#999" }}>
//                   <div>Created: {formatDate(teamData.createdAt)}</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <>
//       <style jsx>{`
//         @keyframes spin {
//           0% {
//             transform: rotate(0deg);
//           }
//           100% {
//             transform: rotate(360deg);
//           }
//         }
//       `}</style>

//       <div className="dashboard__content">
//         <section className="page-title-dashboard">
//           <div className="themes-container">
//             <div className="row">
//               <div className="col-lg-12 col-md-12">
//                 <div className="title-dashboard">
//                   <div className="title-dash flex2">Teams</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {isLoading && (
//           <section className="flat-dashboard-resumes flat-dashboard-setting">
//             <div className="themes-container_main">
//               <div className="flex59">
//                 <Loader />
//               </div>
//             </div>
//           </section>
//         )}

//         {!isLoading && (
//           <>
//             {teams.length > 0 ? (
//               <section className="flat-dashboard-resumes flat-dashboard-setting">
//                 <div className="themes-container_main">
//                   <div className="tf-tab">
//                     <div className="row">
//                       <div className="col-lg-12 col-md-12">
//                         <div className="wrap-profile instruction bg-white">
//                           <div className="instruction_container flex2 flex46">
//                             <div className="group-title md:col-12 col-lg-9">
//                               <h3 className="fw-6 color-3">Team Management</h3>
//                               <p className="mt-2">
//                                 This section provide you teams here. You can
//                                 accept and reject new teams with detailed
//                                 information Accept or reject team invitations to
//                                 manage your participation.
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="profile-setting">
//                           <div className="content-tab cv-stc2">
//                             <div className="inner">
//                               <div className="group-col-1">
//                                 {teams.map((teamItem, index) => (
//                                   <TeamCard
//                                     key={
//                                       getTeamData(teamItem).id ||
//                                       getTeamData(teamItem).teamId ||
//                                       index
//                                     }
//                                     teamItem={teamItem}
//                                     index={index}
//                                   />
//                                 ))}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </section>
//             ) : (
//               <section className="flat-dashboard-resumes flat-dashboard-setting">
//                 <div className="themes-container_main">
//                   <div className="tf-tab">
//                     <div className="row">
//                       <div className="col-lg-12 col-md-12">
//                         <div className="wrap-profile instruction bg-white">
//                           <div className="instruction_container flex2 flex48">
//                             <div className="group-title md:col-12 col-lg-10">
//                               <h3 className="fw-6 color-3">Team Section</h3>
//                               <p className="mt-2">
//                                 Create and manage all Teams for your projects.
//                                 Build your workforce by creating teams and
//                                 maintain a clear overview of your team structure
//                                 and project assignments.
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="row">
//                           <div
//                             className="col-lg-12 col-md-12"
//                             style={{ height: "100vh" }}
//                           >
//                             <div className="profile-setting bg-white">
//                               <div className="form-infor-profile warn-item-center">
//                                 <h3
//                                   style={{
//                                     fontSize: "1.5em",
//                                     display: "flex",
//                                     marginBottom: "5px",
//                                     alignItems: "center",
//                                     gap: "10px",
//                                   }}
//                                 >
//                                   <span
//                                     style={{
//                                       color: "#FFA500",
//                                       fontSize: "1.2em",
//                                     }}
//                                   >
//                                     ⚠️
//                                   </span>
//                                   No Teams Found
//                                 </h3>
//                                 <p style={{ color: "#666", marginTop: "10px" }}>
//                                   Get started by creating your first team to
//                                   organize your projects and manage your
//                                   workforce effectively.
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </section>
//             )}
//           </>
//         )}
//       </div>
//     </>
//   );
// };

// export default Teams;

"use client";
import { useState, useEffect } from "react";
import Loader from "@/components/loader/loader";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import AcceptedTeams from "./Team/AcceptedTeams";
import RejectedTeams from "./Team/RejectedTeams";
import AllTeams from "./Team/AllTeams";
import PendingTeams from "./Team/PendingTeams";

const Teams = () => {
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const token = useSelector((state) => state.currentUser.token);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [activeTab, setActiveTab] = useState("all");

  // Invitation Status Enum
  const InvitationStatus = {
    PENDING: "pending",
    ACCEPTED: "accepted",
    REJECTED: "rejected",
  };

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/contractor-teams", {
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
      console.log("API Response:", result);
      const teamsData = result.teams || result.data || result || [];
      const sortedTeams = Array.isArray(teamsData)
        ? teamsData.sort((a, b) => {
            const dateA = new Date(a.team?.createdAt || a.createdAt || 0);
            const dateB = new Date(b.team?.createdAt || b.createdAt || 0);
            return dateB - dateA;
          })
        : [];
      setTeams(sortedTeams);
    } catch (err) {
      toast.error(err.message || "Oops! Something Went Wrong!");
      console.error("Error fetching teams:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateInvitationStatus = async (teamId, status) => {
    const statusKey = `${teamId}-${status}`;
    setUpdatingStatus((prev) => ({ ...prev, [statusKey]: true }));
    try {
      const response = await fetch("/api/contractor-teams/update-status", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamId,
          status,
        }),
      });
      if (!response.ok) {
        const result = await response.json();
        toast.error(result.message || "Failed to update status!");
        return;
      }
      const result = await response.json();
      console.log("resultresultttttttttttt", result);
      toast.success(`Invitation ${status} successfully!`);
      // Update the local state
      setTeams((prevTeams) =>
        prevTeams.map((teamItem) => {
          const teamData = getTeamData(teamItem);
          if (teamData.id === teamId || teamData.teamId === teamId) {
            return { ...teamItem, isAccepted: status };
          }
          return teamItem;
        })
      );
    } catch (err) {
      toast.error(err.message || "Failed to update status!");
      console.error("Error updating status:", err);
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [statusKey]: false }));
    }
  };

  const getTeamData = (teamItem) => {
    return teamItem.team || teamItem;
  };

  const getUserData = (teamItem) => {
    return teamItem.user || teamItem;
  };

  useEffect(() => {
    if (token) {
      fetchTeams();
    }
  }, [token]);

  const tabs = [
    { id: "all", label: "All Teams", count: teams.length },
    {
      id: "accepted",
      label: "Accepted",
      count: teams.filter(
        (team) => team.isAccepted === InvitationStatus.ACCEPTED
      ).length,
    },
    {
      id: "rejected",
      label: "Rejected",
      count: teams.filter(
        (team) => team.isAccepted === InvitationStatus.REJECTED
      ).length,
    },
    {
      id: "pending",
      label: "Pending",
      count: teams.filter(
        (team) =>
          team.isAccepted === InvitationStatus.PENDING || !team.isAccepted
      ).length,
    },
  ];

  const renderTabContent = () => {
    const commonProps = {
      teams,
      updateInvitationStatus,
      updatingStatus,
      InvitationStatus,
      router,
      getTeamData,
      getUserData,
    };

    switch (activeTab) {
      case "accepted":
        return <AcceptedTeams {...commonProps} />;
      case "rejected":
        return <RejectedTeams {...commonProps} />;
      case "pending":
        return <PendingTeams {...commonProps} />;
      default:
        return <AllTeams {...commonProps} />;
    }
  };

  return (
    <>
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .tab-button {
          background: #fff;
          border: 2px solid #e4e4e4;
          padding: 12px 20px;
          margin-right: 10px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .tab-button:hover {
          border-color: #f47920;
          color: #f47920;
        }
        .tab-button.active {
          background: #f47920;
          border-color: #f47920;
          color: white;
        }
        .tab-count {
          background: rgba(255, 255, 255, 0.2);
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.8em;
          font-weight: 600;
        }
        .tab-button.active .tab-count {
          background: rgba(255, 255, 255, 0.3);
        }
        .tab-button:not(.active) .tab-count {
          background: #f47920;
          color: white;
        }
      `}</style>
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
          <section className="flat-dashboard-resumes flat-dashboard-setting ">
            <div className="themes-container_main">
              <div className="tf-tab">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="wrap-profile instruction bg-white">
                      <div className="instruction_container flex2 flex46">
                        <div className="group-title md:col-12 col-lg-9">
                          <h3 className="fw-6 color-3">Team Management</h3>
                          <p className="mt-2">
                            This section provides you teams here. You can accept
                            and reject new teams with detailed information.
                            Accept or reject team invitations to manage your
                            participation.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div
                      className="bg-white"
                      style={{
                        padding: "20px",
                        marginBottom: "20px",
                        borderRadius: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "10px",
                        }}
                      >
                        {tabs.map((tab) => (
                          <button
                            key={tab.id}
                            className={`tab-button ${
                              activeTab === tab.id ? "active" : ""
                            }`}
                            onClick={() => setActiveTab(tab.id)}
                          >
                            {tab.label}
                            <span className="tab-count">{tab.count}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tab Content */}
                    {renderTabContent()}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default Teams;
