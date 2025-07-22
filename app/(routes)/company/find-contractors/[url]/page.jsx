"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { generateTimeSlots } from "@/utils/generateTimeSlots";
import BookingCalendar from "@/components/company/BookingCalendar";
import Loader from "@/components/loader/loader";

const Page = () => {
  const router = useRouter();
  const token = useSelector((state) => state.currentUser.token);
  const [user, setUser] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const url = params.url;

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/company/all-contractors/${url}`, {
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

      setUser(result.data);
      toast.success(result.success);
    } catch (err) {
      toast.error(err.message);
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const parseTimeStringToDate = (timeStr) => {
    if (!timeStr) return null;
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds || 0, 0);

    return date;
  };

  const handleBooking = (time) => {
    setSelectedTime(time.toISOString());
  };

  const handleAppointment = async () => {
    setIsLoading(true);
    try {
      const formattedDate = selectedDate.toLocaleDateString("en-CA");

      const formattedTime = new Date(selectedTime).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const resp = await fetch("/api/company/book-appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          contractorId: user?.contractorProfile?.id,
          appointmentDate: formattedDate,
          appointmentTime: formattedTime,
          contractorTimezone: user?.contractorProfile?.availabilityZone || "GMT+0000",
          contractorName: `${user?.firstName} ${user?.lastName}`,
          contractorEmail: user?.email,
        }),
      });

      if (!resp.ok) {
        const error = await resp.json();
        toast.error(error.message);
      }
      const result = await resp.json();

      toast.success(result.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
      router.push("/company/find-contractors");
    }
  };

  return (
    <>
      <div className="dashboard__content">
        <section className="page-title-dashboard">
          <div className="themes-container">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="title-dashboard">
                  <div className="title-dash flex2">Schedule Interview</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="flat-dashboard-applicants">
          {isLoading && (
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
          )}
          {!isLoading && (
            <div className="themes-container">
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <section className="flat-dashboard-resumes flat-dashboard-setting">
                    <div className="themes-container">
                      <div className="calendler-overlay">
                        <div className="calender-container">
                          {user?.contractorProfile.startTime &&
                            user?.contractorProfile?.endTime && (
                              <BookingCalendar
                                user={user}
                                handleBooking={(booking) => {
                                  setSelectedDate(booking);
                                  setIsActive(true);
                                }}
                              />
                            )}
                        </div>

                        <div className="dropdown-container">
                          {isActive && (
                            <>
                              <div className="flex2 gap-2">
                                {user?.contractorProfile?.startTime &&
                                  user?.contractorProfile?.endTime && (
                                    <>
                                      <select
                                        className="form-select"
                                        value={selectedTime}
                                        onChange={(e) => handleBooking(new Date(e.target.value))}
                                      >
                                        <option value="">Select a time</option>
                                        {generateTimeSlots(
                                          parseTimeStringToDate(user?.contractorProfile?.startTime),
                                          parseTimeStringToDate(user?.contractorProfile?.endTime),
                                          30
                                        ).map((time) => (
                                          <option
                                            key={time.toISOString()}
                                            value={time.toISOString()}
                                          >
                                            {time.toLocaleTimeString("en-US", {
                                              hour: "numeric",
                                              minute: "2-digit",
                                              hour12: true,
                                            })}
                                          </option>
                                        ))}
                                      </select>

                                      {/* <li>
                                      <a
                                        onClick={() =>
                                          handleAppointment(
                                            user.contractorProfile.id
                                          )
                                        }
                                        className="button-cancel-1 fw-7 remove-file"
                                      >
                                        Schedule Meeting
                                      </a>
                                    </li> */}
                                    </>
                                  )}
                              </div>
                              <div className="flex2 gap-2">
                                <li
                                  style={{
                                    listStyle: "none",
                                    marginTop: "20px",
                                    width: "100%",
                                  }}
                                >
                                  <a
                                    onClick={() => handleAppointment(user.contractorProfile.id)}
                                    className="button-cancel-1 fw-7 remove-file"
                                  >
                                    Schedule Meeting
                                  </a>
                                </li>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default Page;
