"use client";

const TeamCard = ({
  teamItem,
  index,
  updateInvitationStatus,
  updatingStatus,
  InvitationStatus,
  router,
  getTeamData,
  getUserData,
}) => {
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
    const user = member.user || member;
    if (user.firstName || user.lastName) {
      const firstName = user.firstName || "";
      const lastName = user.lastName || "";
      return `${firstName} ${lastName}`.trim();
    }
    if (user.name) return user.name;
    if (user.email) return user.email;
    if (member.email) return member.email;
    return "Unknown Member";
  };

  const getTeamMembers = (teamItem) => {
    const teamData = getTeamData(teamItem);
    const userData = getUserData(teamItem);
    const members = [];
    if (
      userData &&
      (userData.firstName || userData.lastName || userData.email)
    ) {
      members.push({
        id: userData.id || userData.userId,
        name: formatMemberName({ user: userData }),
        email: userData.email,
        isAccepted: teamItem.isAccepted,
        joinedAt: teamItem.joinedAt,
      });
    }
    if (teamData.members && Array.isArray(teamData.members)) {
      teamData.members.forEach((member) => {
        members.push({
          id: member.id,
          name: formatMemberName(member),
          email: member.email,
          specialization: member.specialization,
        });
      });
    }
    return members;
  };

  const getStatusBadgeStyle = (status) => {
    const baseStyle = {
      fontSize: "0.75em",
      padding: "4px 8px",
      borderRadius: "12px",
      display: "inline-block",
      marginRight: "10px",
      fontWeight: "500",
      textTransform: "capitalize",
    };
    switch (status) {
      case InvitationStatus.ACCEPTED:
        return {
          ...baseStyle,
          color: "#28a745",
          backgroundColor: "#d4edda",
          border: "1px solid #c3e6cb",
        };
      case InvitationStatus.REJECTED:
        return {
          ...baseStyle,
          color: "#dc3545",
          backgroundColor: "#f8d7da",
          border: "1px solid #f5c6cb",
        };
      case InvitationStatus.PENDING:
      default:
        return {
          ...baseStyle,
          color: "#856404",
          backgroundColor: "#fff3cd",
          border: "1px solid #ffeaa7",
        };
    }
  };

  const renderActionButtons = (teamItem) => {
    const teamData = getTeamData(teamItem);
    const teamId = teamData.id || teamData.teamId;
    const currentStatus = teamItem.isAccepted;
    if (
      currentStatus === InvitationStatus.ACCEPTED ||
      currentStatus === InvitationStatus.REJECTED
    ) {
      return null;
    }
    return (
      <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
        <button
          onClick={() =>
            updateInvitationStatus(teamId, InvitationStatus.ACCEPTED)
          }
          disabled={updatingStatus[`${teamId}-${InvitationStatus.ACCEPTED}`]}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            fontSize: "0.85em",
            fontWeight: "500",
            cursor: updatingStatus[`${teamId}-${InvitationStatus.ACCEPTED}`]
              ? "not-allowed"
              : "pointer",
            opacity: updatingStatus[`${teamId}-${InvitationStatus.ACCEPTED}`]
              ? 0.7
              : 1,
            display: "flex",
            alignItems: "center",
            gap: "5px",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            if (!updatingStatus[`${teamId}-${InvitationStatus.ACCEPTED}`]) {
              e.target.style.backgroundColor = "#218838";
            }
          }}
          onMouseOut={(e) => {
            if (!updatingStatus[`${teamId}-${InvitationStatus.ACCEPTED}`]) {
              e.target.style.backgroundColor = "#28a745";
            }
          }}
        >
          {updatingStatus[`${teamId}-${InvitationStatus.ACCEPTED}`] ? (
            <>
              <span
                style={{
                  width: "12px",
                  height: "12px",
                  border: "2px solid #ffffff",
                  borderTop: "2px solid transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              ></span>
              Accepting...
            </>
          ) : (
            <>✓ Accept</>
          )}
        </button>
        <button
          onClick={() =>
            updateInvitationStatus(teamId, InvitationStatus.REJECTED)
          }
          disabled={updatingStatus[`${teamId}-${InvitationStatus.REJECTED}`]}
          style={{
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            fontSize: "0.85em",
            fontWeight: "500",
            cursor: updatingStatus[`${teamId}-${InvitationStatus.REJECTED}`]
              ? "not-allowed"
              : "pointer",
            opacity: updatingStatus[`${teamId}-${InvitationStatus.REJECTED}`]
              ? 0.7
              : 1,
            display: "flex",
            alignItems: "center",
            gap: "5px",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            if (!updatingStatus[`${teamId}-${InvitationStatus.REJECTED}`]) {
              e.target.style.backgroundColor = "#c82333";
            }
          }}
          onMouseOut={(e) => {
            if (!updatingStatus[`${teamId}-${InvitationStatus.REJECTED}`]) {
              e.target.style.backgroundColor = "#dc3545";
            }
          }}
        >
          {updatingStatus[`${teamId}-${InvitationStatus.REJECTED}`] ? (
            <>
              <span
                style={{
                  width: "12px",
                  height: "12px",
                  border: "2px solid #ffffff",
                  borderTop: "2px solid transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              ></span>
              rejecting...
            </>
          ) : (
            <>✗ Reject</>
          )}
        </button>
      </div>
    );
  };

  const teamData = getTeamData(teamItem);
  const userData = getUserData(teamItem);
  const teamMembers = getTeamMembers(teamItem);

  return (
    <div
      key={teamData.id || teamData.teamId || index}
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
          {teamData.logoUrl && (
            <img
              src={teamData.logoUrl || "/placeholder.svg"}
              alt={`${teamData.name || "Team"} Logo`}
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
                onClick={() =>
                  router.push(
                    `/contractor/team/${teamData.id || teamData.teamId}`
                  )
                }
                style={{
                  margin: "0 0 5px 0",
                  fontSize: "1.2em",
                  fontWeight: "600",
                  color: "#333",
                  cursor: "pointer",
                }}
              >
                {teamData.name || "Unnamed Team"}
              </h4>
              {teamData.projectType && (
                <span
                  style={{
                    fontSize: "0.85em",
                    color: "#f47920",
                    backgroundColor: "#fff5f0",
                    padding: "4px 10px",
                    borderRadius: "12px",
                    display: "inline-block",
                  }}
                >
                  {teamData.projectType}
                </span>
              )}
            </div>
            {/* Team Description */}
            {teamData.description && (
              <p
                style={{
                  fontSize: "0.95em",
                  color: "#666",
                  marginBottom: "15px",
                  lineHeight: "1.5",
                }}
              >
                {teamData.description}
              </p>
            )}
            {/* Status Badge */}
            {teamItem.isAccepted && (
              <span style={getStatusBadgeStyle(teamItem.isAccepted)}>
                {teamItem.isAccepted}
              </span>
            )}
            {/* Action Buttons */}
            {renderActionButtons(teamItem)}
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
                <div>Created: {formatDate(teamData.createdAt)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
