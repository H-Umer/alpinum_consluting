"use client";
import { useEffect, useState } from "react";
import Loader from "@/components/loader/loader";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";

export default function PublicContractorProfiles() {
  const [allCandidates, setAllCandidates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [publicResume, setPublicResume] = useState([]);
  const router = useRouter();

  useEffect(() => {
    Promise.all([fetchUsers(), fetchPublicResumes()]);
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/company/all-contractors");
      const result = await res.json();
      if (!res.ok) {
        toast.error(res.message);
      }

      const filterUser = result?.candidates?.filter((el) => !el?.lastName?.includes("Dummy"));

      setAllCandidates(filterUser);
    } catch (err) {
      toast.error(err.error);
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPublicResumes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/public-resumes");
      const result = await res.json();
      if (!res.ok) {
        toast.error(res.message);
      }

      setPublicResume(result.data);
    } catch (err) {
      toast.error(err.error);
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
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

  return (
    <>
      <section className="page-title-dashboard page-title-dashboard-public themes-container-public-header">
        <div className="themes-container themes-container-public mb-5">
          <div className="mb-4">
            <div className="col-lg-12 col-md-12 mb-8">
              <div className="d-flex justify-content-center">
                <Image
                  className="site-logo"
                  alt="Image"
                  src="/images/logo/old-logo.png"
                  width={150}
                  height={150}
                />
              </div>
            </div>
          </div>
          <div className="mb-4">
            <div className="col-lg-12 col-md-12 mb-8">
              <div className="alert-danger alert-style">
                <p
                  style={{
                    fontSize: "18px",
                    color: "#dc3545",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: "700",
                  }}
                >
                  Join Our Platform to Hire Skilled Contractors!
                </p>
                <div className=" mb-3 wd-form-login margin-null">
                  <button
                    onClick={() => {
                      router.push("/auth/sign-up");
                    }}
                    className="bg-danger text-white fw-semibold rounded-2 px-4 py-2"
                  >
                    Join Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="title-dashboard">
                <div className="title-dash flex2">Contractor Profiles</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {!loading && (
        <>
          {loading && (
            <section className="flat-dashboard-applicants">
              <div className="themes-container">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <section className="flat-dashboard-resumes flat-dashboard-setting">
                      <div className="themes-container themes-container-public">
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

          {!loading && (
            <>
              <section className="flat-dashboard-applicants">
                <div className="themes-container themes-container-public">
                  <div className="row">
                    <div className="col-lg-12 col-md-12">
                      {/* it starts from here */}
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
                        <h3 className="title-appli">View Top Talents</h3>
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
                                {filteredUsers?.map((user) => (
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
                                          <h5 className="fw-6 color-3">{user?.designation}</h5>
                                          <h3
                                            className="contractor-name"
                                            onClick={() => {
                                              console.log(user);
                                              if (user?.source === "contractor") {
                                                router.push(`/contractors/${user?.id}`);
                                              } else {
                                                router.push(
                                                  `/contractors/${user?.id}?resumeProfile=true`
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
                                                  {user?.city + ", " + user?.country}
                                                </div>
                                              </div>
                                            )
                                          ) : (
                                            <div className="now-box flex2">
                                              Experience: {user?.city} years
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </td>

                                    <td>
                                      <div className="action-wrap">
                                        <ul className="flex2 gap-2">
                                          <li>
                                            <a
                                              onClick={() => router.push("/")}
                                              className="button-cancel-1 fw-7 remove-file"
                                            >
                                              Hire Me
                                            </a>
                                          </li>
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
            </>
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
      {/* </div> */}
    </>
  );
}
