import TeamCard from "./TeamCard";

const RejectedTeams = ({
  teams,
  updateInvitationStatus,
  updatingStatus,
  InvitationStatus,
  router,
  getTeamData,
  getUserData,
}) => {
  const rejectedTeams = teams.filter(
    (team) => team.isAccepted === InvitationStatus.REJECTED
  );

  if (rejectedTeams.length === 0) {
    return (
      <div className="row">
        <div className="col-lg-12 col-md-12" style={{ height: "100vh" }}>
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
                <span style={{ color: "#dc3545", fontSize: "1.2em" }}>❌</span>
                No Rejected Teams
              </h3>
              <p style={{ color: "#666", marginTop: "10px" }}>
                You haven't rejected any team invitations. This section will
                show teams you've declined to join.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-setting">
      <div className="content-tab cv-stc2">
        <div className="inner">
          <div className="group-col-1">
            {rejectedTeams.map((teamItem, index) => (
              <TeamCard
                key={
                  getTeamData(teamItem).id ||
                  getTeamData(teamItem).teamId ||
                  index
                }
                teamItem={teamItem}
                index={index}
                updateInvitationStatus={updateInvitationStatus}
                updatingStatus={updatingStatus}
                InvitationStatus={InvitationStatus}
                router={router}
                getTeamData={getTeamData}
                getUserData={getUserData}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectedTeams;
