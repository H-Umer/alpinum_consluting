import TeamCard from "./TeamCard";

const PendingTeams = ({
  teams,
  updateInvitationStatus,
  updatingStatus,
  InvitationStatus,
  router,
  getTeamData,
  getUserData,
}) => {
  const pendingTeams = teams.filter(
    (team) => team.isAccepted === InvitationStatus.PENDING || !team.isAccepted
  );

  if (pendingTeams.length === 0) {
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
                <span style={{ color: "#f47920", fontSize: "1.2em" }}>⏳</span>
                No Pending Invitations
              </h3>
              <p style={{ color: "#666", marginTop: "10px" }}>
                You don't have any pending team invitations at the moment. New
                invitations will appear here.
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
            {pendingTeams.map((teamItem, index) => (
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

export default PendingTeams;
