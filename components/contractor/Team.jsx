// "use client";
// import { useState, useEffect } from "react";
// import Loader from "@/components/loader/loader";
// import { toast } from "react-toastify";
// import { useSelector } from "react-redux";
// import { useRouter } from "next/navigation";
// import { FaRegTrashCan } from "react-icons/fa6";

// const Teams = () => {
//   const router = useRouter();
//   const [teams, setTeams] = useState([]);
//   const token = useSelector((state) => state.currentUser.token);
//   const [isLoading, setIsLoading] = useState(false);

//   const fetchTeams = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch("/api/team", {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       console.log("responseeeeeeeeeeeeeeeeee", response);

//       if (!response.ok) {
//         const result = await response.json();
//         toast.error(result.message || "Oops! Something Went Wrong!");
//         return;
//       }

//       const result = await response.json();
//       console.log("resultttttttttt", result);

//       // Handle the response structure - it could be result.teams or just result
//       const teamsData = result.teams || result || [];
//       const sortedTeams = teamsData.sort(
//         (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//       );
//       setTeams(sortedTeams);
//     } catch (err) {
//       toast.error(err.message || "Oops! Something Went Wrong!");
//       console.error("err", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString();
//   };

//   // Helper function to format member names
//   const formatMemberName = (member) => {
//     if (!member.user) return "";
//     const firstName = member.user.firstName || "";
//     const lastName = member.user.lastName || "";
//     return firstName || lastName
//       ? `${firstName} ${lastName}`.trim()
//       : member.user.email;
//   };

//   useEffect(() => {
//     if (token) {
//       fetchTeams();
//     }
//   }, [token]);

//   const handleDeleteTeam = async (teamId) => {
//     const confirmDelete = confirm("Are you sure you want to delete this team?");
//     if (!confirmDelete) return;

//     // setIsLoading(true);
//     try {
//       const response = await fetch(`/api/team/${teamId}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         toast.error(result.message || "Failed to delete team.");
//         return;
//       }

//       toast.success(result.message || "Team deleted successfully.");

//       // Remove deleted team from state
//       setTeams((prev) => prev.filter((team) => team.id !== teamId));
//     } catch (error) {
//       console.error("Delete error:", error);
//       toast.error("An error occurred while deleting the team.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="dashboard__content">
//       <section className="page-title-dashboard">
//         <div className="themes-container">
//           <div className="row">
//             <div className="col-lg-12 col-md-12">
//               <div className="title-dashboard">
//                 <div className="title-dash flex2">Teams</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {isLoading && (
//         <section className="flat-dashboard-resumes flat-dashboard-setting">
//           <div className="themes-container_main">
//             <div className="flex59">
//               <Loader />
//             </div>
//           </div>
//         </section>
//       )}

//       {!isLoading &&
//         (teams.length > 0 ? (
//           <section className="flat-dashboard-resumes flat-dashboard-setting">
//             <div className="themes-container_main">
//               <div className="tf-tab">
//                 <div className="row">
//                   <div className="col-lg-12 col-md-12 ">
//                     <div className="wrap-profile instruction bg-white">
//                       <div className="instruction_container flex2 flex46">
//                         <div className="group-title md:col-12 col-lg-9">
//                           <h3 className="fw-6 color-3">Team Management</h3>
//                           <p className="mt-2">
//                             Create and manage your teams here. You can create
//                             new teams with detailed information and manage team
//                             members efficiently. View all your teams and
//                             organize your workforce effectively for better
//                             project coordination.
//                           </p>
//                         </div>
//                         <div className="moodlePortal2 md:col-12 col-lg-3">
//                           <div className="tt-button1 tt-button tt-button2 moodlePortal ">
//                             <a
//                               onClick={() =>
//                                 router.push("/contractor/create-team")
//                               }
//                             >
//                               Create Team
//                             </a>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="profile-setting ">
//                       <div className="content-tab cv-stc2 ">
//                         <div className="inner ">
//                           <div className="group-col-1 ">
//                             {teams.map((team, index) => (
//                               <div
//                                 key={team.id || index}
//                                 className="wd-cv-template cl4 "
//                                 style={{
//                                   marginBottom: "20px",
//                                   padding: "20px",
//                                   border: "1px solid #e4e4e4",
//                                   borderRadius: "8px",
//                                   backgroundColor: "#fff",
//                                   boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
//                                 }}
//                               >
//                                 <div className="content">
//                                   <div
//                                     style={{
//                                       display: "flex",
//                                       gap: "20px",
//                                       alignItems: "flex-start",
//                                     }}
//                                   >
//                                     {team.logoUrl && (
//                                       <img
//                                         src={team.logoUrl || "/placeholder.svg"}
//                                         alt={`${team.name} Logo`}
//                                         style={{
//                                           width: "100px",
//                                           height: "100px",
//                                           borderRadius: "8px",
//                                           objectFit: "cover",
//                                           border: "1px solid #e4e4e4",
//                                         }}
//                                         onError={(e) => {
//                                           e.target.src = "/placeholder.svg";
//                                         }}
//                                       />
//                                     )}
//                                     <div style={{ flex: 1 }}>
//                                       <div style={{ marginBottom: "10px" }}>
//                                         <h4
//                                           style={{
//                                             margin: "0 0 5px 0",
//                                             fontSize: "1.2em",
//                                             fontWeight: "600",
//                                             color: "#333",
//                                           }}
//                                         >
//                                           {team.name}
//                                         </h4>
//                                         {team.projectType && (
//                                           <span
//                                             style={{
//                                               fontSize: "0.85em",
//                                               color: "#0066cc",
//                                               backgroundColor: "#f0f8ff",
//                                               padding: "4px 10px",
//                                               borderRadius: "12px",
//                                               display: "inline-block",
//                                             }}
//                                           >
//                                             {team.projectType}
//                                           </span>
//                                         )}
//                                       </div>
//                                       {team.description && (
//                                         <p
//                                           style={{
//                                             fontSize: "0.95em",
//                                             color: "#666",
//                                             marginBottom: "15px",
//                                             lineHeight: "1.5",
//                                           }}
//                                         >
//                                           {team.description}
//                                         </p>
//                                       )}
//                                       <div
//                                         style={{
//                                           display: "flex",
//                                           flexWrap: "wrap",
//                                           gap: "15px",
//                                           marginBottom: "15px",
//                                         }}
//                                       >
//                                         {team.members &&
//                                           team.members.length > 0 && (
//                                             <div>
//                                               <h5
//                                                 style={{
//                                                   margin: "0 0 5px 0",
//                                                   fontSize: "0.95em",
//                                                   fontWeight: "600",
//                                                   color: "#333",
//                                                 }}
//                                               >
//                                                 Team Members (
//                                                 {team.members.length})
//                                               </h5>
//                                               <div
//                                                 style={{
//                                                   display: "flex",
//                                                   flexWrap: "wrap",
//                                                   gap: "5px",
//                                                 }}
//                                               >
//                                                 {team.members.map(
//                                                   (member, i) => (
//                                                     <span
//                                                       key={member.id || i}
//                                                       style={{
//                                                         backgroundColor:
//                                                           "#f8f9fa",
//                                                         color: "#495057",
//                                                         padding: "4px 10px",
//                                                         borderRadius: "15px",
//                                                         fontSize: "0.85em",
//                                                         border:
//                                                           "1px solid #dee2e6",
//                                                       }}
//                                                     >
//                                                       {formatMemberName(member)}
//                                                       {member.role &&
//                                                         ` (${member.role})`}
//                                                     </span>
//                                                   )
//                                                 )}
//                                               </div>
//                                             </div>
//                                           )}
//                                       </div>
//                                       <div
//                                         style={{
//                                           display: "flex",
//                                           justifyContent: "space-between",
//                                           alignItems: "center",
//                                           borderTop: "1px solid #eee",
//                                           paddingTop: "15px",
//                                           marginTop: "15px",
//                                         }}
//                                       >
//                                         <span
//                                           style={{
//                                             fontSize: "0.85em",
//                                             color: "#999",
//                                           }}
//                                         >
//                                           Created: {formatDate(team.createdAt)}
//                                         </span>
//                                         <div
//                                           style={{
//                                             display: "flex",
//                                             gap: "10px",
//                                           }}
//                                         >
//                                           {/* <button
//                                             style={{
//                                               padding: "6px 12px",
//                                               fontSize: "0.85em",
//                                               backgroundColor: "#007bff",
//                                               color: "white",
//                                               border: "none",
//                                               borderRadius: "4px",
//                                               cursor: "pointer",
//                                             }}
//                                             onClick={() => {
//                                               // Add edit functionality here
//                                               console.log(
//                                                 "Edit team:",
//                                                 team.id
//                                               );
//                                             }}
//                                           >
//                                             Edit
//                                           </button> */}
//                                           {/* <button
//                                             style={{
//                                               padding: "6px 12px",
//                                               fontSize: "0.85em",
//                                               backgroundColor: "#28a745",
//                                               color: "white",
//                                               border: "none",
//                                               borderRadius: "4px",
//                                               cursor: "pointer",
//                                             }}
//                                             onClick={() => {
//                                               // Add view details functionality here
//                                               console.log(
//                                                 "View team:",
//                                                 team.id
//                                               );
//                                             }}
//                                           >
//                                             View Details
//                                           </button> */}
//                                           <button
//                                             // className="px-[6px] py-[6px] text-[0.85em] text-red-600 border-none rounded cursor-pointer"
//                                             style={{
//                                               padding: "6px 6px",
//                                               fontSize: "1.5em",
//                                               color: "red",
//                                               border: "none",
//                                               borderRadius: "4px",
//                                               cursor: "pointer",
//                                             }}
//                                             onClick={() =>
//                                               handleDeleteTeam(team.id)
//                                             }
//                                           >
//                                             <FaRegTrashCan />
//                                           </button>
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>
//         ) : (
//           <section className="flat-dashboard-resumes flat-dashboard-setting">
//             <div className="themes-container_main">
//               <div className="tf-tab">
//                 <div className="row">
//                   <div className="col-lg-12 col-md-12 ">
//                     <div className="wrap-profile instruction bg-white">
//                       <div className="instruction_container flex2 flex48">
//                         <div className="group-title md:col-12 col-lg-10">
//                           <h3 className="fw-6 color-3">Team Section</h3>
//                           <p className="mt-2">
//                             Create and manage all Teams for your projects. Build
//                             your workforce by creating teams and maintain a
//                             clear overview of your team structure and project
//                             assignments.
//                           </p>
//                         </div>
//                         <div className="action-wrap">
//                           <ul className="flex2 gap-2">
//                             <div>
//                               <li>
//                                 <a
//                                   className="button-cancel-1 fw-7 remove-file"
//                                   onClick={() =>
//                                     router.push("/contractor/create-team")
//                                   }
//                                 >
//                                   Create Team
//                                 </a>
//                               </li>
//                             </div>
//                           </ul>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="row">
//                       <div
//                         className="col-lg-12 col-md-12"
//                         style={{
//                           height: "100vh",
//                         }}
//                       >
//                         <div className="profile-setting bg-white">
//                           <div className="form-infor-profile warn-item-center">
//                             <h3
//                               className=""
//                               style={{
//                                 fontSize: "1.5em",
//                                 display: "flex",
//                                 marginBottom: "5px",
//                               }}
//                             >
//                               {" "}
//                               <span
//                                 style={{ color: "#FFA500", fontSize: "1.2em" }}
//                               >
//                                 ⚠️
//                               </span>
//                               No Teams Found
//                             </h3>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>
//         ))}
//     </div>
//   );
// };

// export default Teams;

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

      console.log("responseeeeeeeeeeeeeeeeee", response);

      if (!response.ok) {
        const result = await response.json();
        toast.error(result.message || "Oops! Something Went Wrong!");
        return;
      }

      const result = await response.json();
      console.log("resultttttttttt", result);

      // Handle the response structure - it could be result.teams or just result
      const teamsData = result.teams || result || [];
      const sortedTeams = teamsData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setTeams(sortedTeams);
    } catch (err) {
      toast.error(err.message || "Oops! Something Went Wrong!");
      console.error("err", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Helper function to format existing member names
  const formatMemberName = (member) => {
    if (!member.user) return "";
    const firstName = member.user.firstName || "";
    const lastName = member.user.lastName || "";
    return firstName || lastName
      ? `${firstName} ${lastName}`.trim()
      : member.user.email;
  };

  // Helper function to format new team member names
  const formatNewMemberName = (member) => {
    return member.name || member.email || "Unknown Member";
  };

  // Helper function to get all team members (both existing and new)
  const getAllTeamMembers = (team) => {
    const existingMembers = team.members || [];
    const newMembers = team.NewTeamMembers || [];

    return {
      existing: existingMembers,
      new: newMembers,
      totalCount: existingMembers.length + newMembers.length,
    };
  };

  useEffect(() => {
    if (token) {
      fetchTeams();
    }
  }, [token]);

  const handleDeleteTeam = async (teamId) => {
    const confirmDelete = confirm("Are you sure you want to delete this team?");
    if (!confirmDelete) return;

    // setIsLoading(true);
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

      // Remove deleted team from state
      setTeams((prev) => prev.filter((team) => team.id !== teamId));
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An error occurred while deleting the team.");
    } finally {
      setIsLoading(false);
    }
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

      {!isLoading &&
        (teams.length > 0 ? (
          <section className="flat-dashboard-resumes flat-dashboard-setting">
            <div className="themes-container_main">
              <div className="tf-tab">
                <div className="row">
                  <div className="col-lg-12 col-md-12 ">
                    <div className="wrap-profile instruction bg-white">
                      <div className="instruction_container flex2 flex46">
                        <div className="group-title md:col-12 col-lg-9">
                          <h3 className="fw-6 color-3">Team Management</h3>
                          <p className="mt-2">
                            Create and manage your teams here. You can create
                            new teams with detailed information and manage team
                            members efficiently. View all your teams and
                            organize your workforce effectively for better
                            project coordination.
                          </p>
                        </div>
                        <div className="moodlePortal2 md:col-12 col-lg-3">
                          <div className="tt-button1 tt-button tt-button2 moodlePortal ">
                            <a
                              onClick={() =>
                                router.push("/contractor/create-team")
                              }
                            >
                              Create Team
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="profile-setting ">
                      <div className="content-tab cv-stc2 ">
                        <div className="inner ">
                          <div className="group-col-1 ">
                            {teams.map((team, index) => {
                              const teamMembers = getAllTeamMembers(team);

                              return (
                                <div
                                  key={team.id || index}
                                  className="wd-cv-template cl4 "
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
                                      {team.logoUrl && (
                                        <img
                                          src={
                                            team.logoUrl || "/placeholder.svg"
                                          }
                                          alt={`${team.name} Logo`}
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
                                      <div style={{ flex: 1 }}>
                                        <div style={{ marginBottom: "10px" }}>
                                          <h4
                                            onClick={() =>
                                              router.push(
                                                `/contractor/team/${team.id}`
                                              )
                                            }
                                            style={{
                                              margin: "0 0 5px 0",
                                              fontSize: "1.2em",
                                              fontWeight: "600",
                                              color: "#333",
                                            }}
                                          >
                                            {team.name}
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

                                        {/* Team Members Section */}
                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "15px",
                                            marginBottom: "15px",
                                          }}
                                        >
                                          {teamMembers.totalCount > 0 && (
                                            <div>
                                              <h5
                                                style={{
                                                  margin: "0 0 10px 0",
                                                  fontSize: "0.95em",
                                                  fontWeight: "600",
                                                  color: "#333",
                                                }}
                                              >
                                                Team Members (
                                                {teamMembers.totalCount})
                                              </h5>

                                              {/* Existing Members */}
                                              {teamMembers.existing.length >
                                                0 && (
                                                <div
                                                  style={{
                                                    marginBottom: "10px",
                                                  }}
                                                >
                                                  <h6
                                                    style={{
                                                      margin: "0 0 5px 0",
                                                      fontSize: "0.85em",
                                                      fontWeight: "500",
                                                      color: "#555",
                                                    }}
                                                  >
                                                    Current Members
                                                  </h6>
                                                  <div
                                                    style={{
                                                      display: "flex",
                                                      flexWrap: "wrap",
                                                      gap: "5px",
                                                    }}
                                                  >
                                                    {teamMembers.existing.map(
                                                      (member, i) => (
                                                        <span
                                                          key={member.id || i}
                                                          style={{
                                                            backgroundColor:
                                                              "#e8f5e8",
                                                            color: "#2d5a2d",
                                                            padding: "4px 10px",
                                                            borderRadius:
                                                              "15px",
                                                            fontSize: "0.85em",
                                                            border:
                                                              "1px solid #c3e6c3",
                                                          }}
                                                        >
                                                          {formatMemberName(
                                                            member
                                                          )}
                                                          {member.role &&
                                                            ` (${member.role})`}
                                                        </span>
                                                      )
                                                    )}
                                                  </div>
                                                </div>
                                              )}

                                              {/* New Team Members */}
                                              {teamMembers.new.length > 0 && (
                                                <div>
                                                  <h6
                                                    style={{
                                                      margin: "0 0 5px 0",
                                                      fontSize: "0.85em",
                                                      fontWeight: "500",
                                                      color: "#555",
                                                    }}
                                                  >
                                                    New Members
                                                  </h6>
                                                  <div
                                                    style={{
                                                      display: "flex",
                                                      flexWrap: "wrap",
                                                      gap: "5px",
                                                    }}
                                                  >
                                                    {teamMembers.new.map(
                                                      (member, i) => (
                                                        <span
                                                          key={i}
                                                          style={{
                                                            backgroundColor:
                                                              "#fff3cd",
                                                            color: "#856404",
                                                            padding: "4px 10px",
                                                            borderRadius:
                                                              "15px",
                                                            fontSize: "0.85em",
                                                            border:
                                                              "1px solid #ffeaa7",
                                                            position:
                                                              "relative",
                                                          }}
                                                          title={`Email: ${member.email}\nSpecialization: ${member.specialization}\nType: ${member.type}`}
                                                        >
                                                          {formatNewMemberName(
                                                            member
                                                          )}
                                                          {member.specialization && (
                                                            <span
                                                              style={{
                                                                fontSize:
                                                                  "0.75em",
                                                                marginLeft:
                                                                  "5px",
                                                                opacity: "0.8",
                                                              }}
                                                            >
                                                              (
                                                              {
                                                                member.specialization
                                                              }
                                                              )
                                                            </span>
                                                          )}
                                                        </span>
                                                      )
                                                    )}
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </div>

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
                                          <span
                                            style={{
                                              fontSize: "0.85em",
                                              color: "#999",
                                            }}
                                          >
                                            Created:{" "}
                                            {formatDate(team.createdAt)}
                                          </span>
                                          <div
                                            style={{
                                              display: "flex",
                                              gap: "10px",
                                            }}
                                          >
                                            <button
                                              style={{
                                                padding: "6px 6px",
                                                fontSize: "1.5em",
                                                color: "red",
                                                border: "none",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                              }}
                                              onClick={() =>
                                                handleDeleteTeam(team.id)
                                              }
                                            >
                                              <FaRegTrashCan />
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
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
                  <div className="col-lg-12 col-md-12 ">
                    <div className="wrap-profile instruction bg-white">
                      <div className="instruction_container flex2 flex48">
                        <div className="group-title md:col-12 col-lg-10">
                          <h3 className="fw-6 color-3">Team Section</h3>
                          <p className="mt-2">
                            Create and manage all Teams for your projects. Build
                            your workforce by creating teams and maintain a
                            clear overview of your team structure and project
                            assignments.
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
                        style={{
                          height: "100vh",
                        }}
                      >
                        <div className="profile-setting bg-white">
                          <div className="form-infor-profile warn-item-center">
                            <h3
                              className=""
                              style={{
                                fontSize: "1.5em",
                                display: "flex",
                                marginBottom: "5px",
                              }}
                            >
                              {" "}
                              <span
                                style={{ color: "#FFA500", fontSize: "1.2em" }}
                              >
                                ⚠️
                              </span>
                              No Teams Found
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
    </div>
  );
};

export default Teams;
