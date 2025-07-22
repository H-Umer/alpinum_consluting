"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loader from "../loader/loader";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Contractors() {
  const token = useSelector((state) => state.currentUser.token);
  const user = useSelector((state) => state.currentUser.user);
  const [allCandidates, setAllCandidates] = useState([]);
  const [publicResume, setPublicResume] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [sendingEmail, setSendingEmail] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (token) {
      Promise.all([fetchUsers(), fetchPublicResumes()]);
    }
  }, [token]);

  const fetchUsers = async () => {
    setLoading1(true);
    try {
      const res = await fetch("/api/company/all-contractors", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(res.message);
      }
      const filterUser = result.candidates.filter(
        (el) => !el.lastName.includes("Dummy")
      );
      setAllCandidates(filterUser);
    } catch (err) {
      toast.error(err.message);
      console.error("Error fetching users:", err);
    } finally {
      setLoading1(false);
    }
  };

  const fetchPublicResumes = async () => {
    setLoading1(true);
    try {
      const res = await fetch("/api/public-resumes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(res.message);
      }
      setPublicResume(result.data);
    } catch (err) {
      toast.error(err.error);
      console.error("Error fetching users:", err);
    } finally {
      setLoading1(false);
    }
  };

  const sendEmailToAdmin = async (resumeCode, userId) => {
    setSendingEmail((prev) => ({ ...prev, [userId]: true }));
    try {
      const res = await fetch("/api/company/send-email-to-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ resumeCode, companyName: user?.companyName }),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.message);
      }
      toast.success("Your Connection Request Has Been Sent!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSendingEmail((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleDownloadCV = async (doc) => {
    if (!doc) {
      console.error("No file URL found");
      return;
    }
    try {
      const response = await fetch(doc);
      if (!response.ok) {
        throw new Error("Failed to fetch document");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = doc.split("/").pop() || "document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const publicResumes = publicResume?.map((pr) => ({
    id: pr.id,
    name: pr.code,
    designation: pr.designation,
    experience: pr.experience,
    imageUrl: null,
    email: null,
    source: "public",
    startTime: null,
    endTime: null,
    availabilityDays: [],
    city: pr.experience,
    country: null,
    resume: pr.resumeUrl || null,
  }));

  const candidates = allCandidates?.map((el) => ({
    id: el.id,
    name: `${el.firstName} ${el.lastName}`,
    designation: el?.contractorProfile?.designation || null,
    experience: el?.contractorProfile?.yearsExperience || 0,
    imageUrl: el?.contractorProfile?.imageUrl || null,
    email: el?.email,
    startTime: el?.contractorProfile?.startTime || null,
    endTime: el?.contractorProfile?.endTime || null,
    availabilityDays: el?.contractorProfile?.availabilityDays || [],
    source: "contractor",
    city: el?.contractorProfile?.city,
    country: el?.contractorProfile?.country,
    resume: el?.resumeUrl || null,
  }));

  const mergedAllCandidates = [...candidates, ...publicResumes];

  const filteredUsers = mergedAllCandidates?.filter((user) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      user?.name?.toLowerCase().includes(searchTerm) ||
      user?.designation?.toLowerCase().includes(searchTerm) ||
      user?.city?.toLowerCase().includes(searchTerm) ||
      user?.country?.toLowerCase().includes(searchTerm)
    );
  });

  const handleAppointment = (url) => {
    try {
      setLoading(true);
      if (url !== undefined && url !== null) {
        router.push(`/company/find-contractors/${url}`);
      } else {
        toast.error("Invitation Url not Found.");
      }
    } catch (err) {
      toast.error(err.message);
      console.log("err", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOffers = (id) => {
    try {
      setLoading(true);
      router.push(`/company/offers/${id}`);
    } catch (err) {
      toast.error(err.message);
      console.log("err", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle navigation to teams page
  const handleTeamsNavigation = () => {
    try {
      setLoading(true);
      router.push("/company/find-teams");
    } catch (err) {
      toast.error(err.message);
      console.log("err", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard__content">
      <section className="page-title-dashboard">
        <div className="themes-container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="title-dashboard">
                <div className="title-dash flex2">Contractors </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Buttons */}
      <section className="tab-navigation">
        <div className="themes-container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="tab-buttons" style={{ marginBottom: "20px" }}>
                <button
                  className="tab-button active"
                  style={{
                    padding: "12px 24px",
                    marginRight: "10px",
                    border: "2px solid #f47920",
                    backgroundColor: "#f47920",
                    color: "white",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                  }}
                >
                  View Top Contractors
                </button>
                <button
                  className="tab-button "
                  onClick={handleTeamsNavigation}
                  disabled={loading}
                  style={{
                    padding: "12px 24px",
                    border: "2px solid #f47920",
                    backgroundColor: "transparent",
                    color: "#f47920",
                    borderRadius: "6px",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading ? "Loading..." : "Teams"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {!loading && (
        <>
          {loading1 && (
            <section className="flat-dashboard-applicants">
              <div className="themes-container">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <section className="flat-dashboard-resumes flat-dashboard-setting">
                      <div className="themes-container">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "90vh",
                          }}
                        >
                          <Loader />
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </section>
          )}

          {!loading1 && (
            <section className="flat-dashboard-applicants">
              <div className="themes-container">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="search-container">
                      <div className="search-wrapper">
                        <input
                          type="text"
                          placeholder="Search by name, designation, or location..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="search-input"
                        />
                        <div className="search-icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="applicants bg-white">
                      <h3 className="title-appli">View Top Contractors</h3>
                      <div className="table-content">
                        <div className="wrap-applicants table-responsive">
                          <table>
                            <thead>
                              <tr>
                                <th>Details</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredUsers.map((user) => (
                                <tr key={user?.id} className="file-delete">
                                  <td>
                                    <div className="candidates-wrap flex2">
                                      <div className="image-shrink">
                                        <img
                                          alt="Profile Picture"
                                          style={{
                                            objectFit: "cover",
                                            objectPosition: "center",
                                            border: "1px solid #e4e4e4",
                                            width: "120px",
                                            height: "120px",
                                            borderRadius: "5%",
                                          }}
                                          src={
                                            user?.imageUrl
                                              ? user?.imageUrl
                                              : "/images/profile/placeholder.jpg"
                                          }
                                        />
                                      </div>
                                      <div className="content">
                                        <h5 className="fw-6 color-3">
                                          {user?.designation}
                                        </h5>
                                        <h3
                                          className="contractor-name"
                                          onClick={() => {
                                            if (user?.source === "contractor") {
                                              router.push(
                                                `/company/contractor-profile/${user?.id}`
                                              );
                                            } else {
                                              router.push(
                                                `/company/contractor-profile/${user?.id}?resumeProfile=true`
                                              );
                                            }
                                          }}
                                        >
                                          {user?.name}
                                        </h3>
                                        {user?.source === "contractor" ? (
                                          user.city &&
                                          user.country && (
                                            <div className="now-box flex2">
                                              <div className="map color-4">
                                                {user?.city +
                                                  ", " +
                                                  user?.country}
                                              </div>
                                            </div>
                                          )
                                        ) : (
                                          <div className="now-box flex2">
                                            Experience {user?.city} year
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="action-wrap">
                                      <ul className="flex2 gap-2">
                                        {user?.source === "contractor" ? (
                                          <>
                                            {user.startTime &&
                                              user?.endTime &&
                                              user?.availabilityDays.length >
                                                0 && (
                                                <>
                                                  <li>
                                                    <a
                                                      onClick={() =>
                                                        handleAppointment(
                                                          user.id
                                                        )
                                                      }
                                                      className="button-cancel-1 fw-7 remove-file"
                                                    >
                                                      Schedule Meeting
                                                    </a>
                                                  </li>
                                                  <li>
                                                    <a
                                                      onClick={() =>
                                                        handleOffers(user.id)
                                                      }
                                                      className="button-cancel-1 fw-7 remove-file"
                                                    >
                                                      Offer Contract
                                                    </a>
                                                  </li>
                                                </>
                                              )}
                                          </>
                                        ) : (
                                          <>
                                            <li>
                                              <a
                                                onClick={() =>
                                                  sendEmailToAdmin(
                                                    user.name,
                                                    user.id
                                                  )
                                                }
                                                className="button-cancel-1 fw-7 remove-file"
                                              >
                                                {sendingEmail[user.id]
                                                  ? "Requesting..."
                                                  : "Get Connected"}
                                              </a>
                                            </li>
                                            <li>
                                              <a
                                                onClick={() =>
                                                  handleDownloadCV(user.resume)
                                                }
                                                className="button-cancel-1 fw-7 remove-file"
                                              >
                                                View Resume
                                              </a>
                                            </li>
                                          </>
                                        )}
                                      </ul>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
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

      {loading && (
        <section className="flat-dashboard-applicants">
          <div className="themes-container">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <section className="flat-dashboard-resumes flat-dashboard-setting">
                  <div className="themes-container">
                    <div className="flex59">
                      <Loader />
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
