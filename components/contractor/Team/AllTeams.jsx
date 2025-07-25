import TeamCard from "./TeamCard";

const AllTeams = ({
  teams,
  updateInvitationStatus,
  updatingStatus,
  InvitationStatus,
  router,
  getTeamData,
  getUserData,
}) => {
  if (teams.length === 0) {
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
                <span style={{ color: "#FFA500", fontSize: "1.2em" }}>⚠️</span>
                No Teams Found
              </h3>
              <p style={{ color: "#666", marginTop: "10px" }}>
                Get started by creating your first team to organize your
                projects and manage your workforce effectively.
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
            {teams.map((teamItem, index) => (
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

export default AllTeams;
