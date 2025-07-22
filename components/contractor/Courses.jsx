"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Link from "next/link";
import Loader from "../loader/loader";

const Courses = () => {
  const token = useSelector((state) => state.currentUser.token);
  const user = useSelector((state) => state.currentUser.user);
  const [allCourses, setAllCourses] = useState([]);
  const [userEnrolledCourses, setUserEnrolledCourses] = useState([]);
  const [courseEnrollmentStatus, setCourseEnrollmentStatus] = useState(null);
  const [isLoading, setIsloading] = useState(false);

  useEffect(() => {
    allMoodleCourse();
  }, []);

  const getCompletionPercentage = (Id) => {
    const course = userEnrolledCourses?.find((enrollment) => enrollment.moodleCourseId === Id);

    if (course) {
      const courseDetail = courseEnrollmentStatus?.coursesDetail?.some(
        (enrollment) => enrollment.courseId === Id?.moodleCourseId
      );

      if (courseDetail) {
        const completedCourses = courseEnrollmentStatus?.coursesDetail?.filter((course) => {
          return course.status === "Yes" || course.complete === true;
        });

        const percentage = Math.round(
          (completedCourses?.length / courseEnrollmentStatus?.coursesLength) * 100
        );
        return percentage;
      }
    }
  };

  // useEffect(() => {
  //   const fetchAllEnrollStatus = async () => {
  //     await Promise.all(
  //       userEnrolledCourses.map((enrollment) =>
  //         handleCourseEnrollStatus(enrollment.moodleCourseId)
  //       )
  //     );
  //   };

  //   if (userEnrolledCourses?.length > 0) {
  //     fetchAllEnrollStatus();
  //   }
  // }, [userEnrolledCourses]);

  const allMoodleCourse = async () => {
    setIsloading(true);

    try {
      const resp = await fetch("/api/moodle-courses", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await resp.json();

      if (!resp.ok) {
        toast.error(result.error);
        console.log(result.message);
      }
      setAllCourses(result.courses);
      allEnrolledCourses();
    } catch (err) {
      console.error("Error", err);
      toast.error(err.error);
    } finally {
      setIsloading(true);
    }
  };

  const allEnrolledCourses = async () => {
    setIsloading(true);
    try {
      const resp = await fetch("/api/user-courses", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!resp) {
        toast.error(error.message);
        console.log(error.message);
      }

      const result = await resp.json();
      setUserEnrolledCourses(result.userEnrollments);
      if (result.data.length < 0) {
        setIsloading(true);
      }
    } catch (error) {
      console?.error("Error", error.error);
      toast.error(error.error);
    } finally {
      setIsloading(false);
    }
  };

  const isUserEnrolled = (courseId) => {
    const enrolledCourse = userEnrolledCourses?.some(
      (enrollment) => enrollment.moodleCourseId === courseId
    );
    return enrolledCourse;
  };

  const handleCourseEnrollStatus = async (courseId) => {
    setIsloading(true);
    try {
      const resp = await fetch("/api/course-status", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: courseId,
        }),
      });
      const result = await resp.json();

      if (!resp.ok) {
        toast.error(result.error);
      }

      setCourseEnrollmentStatus(result);
    } catch (err) {
      console.error("Error", err.error);
      toast.error(err.error);
    } finally {
      setIsloading(false);
    }
  };

  const handleSubmit = async (course) => {
    setIsloading(true);
    try {
      const resp = await fetch("/api/course-enrollment", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: course.courseId,
          courseName: course.courseName,
        }),
      });

      const result = await resp.json();

      if (!resp.ok) {
        toast.error(result.error);
      }

      if (resp.status === 201) {
        toast.success(result.message);
        allEnrolledCourses();
      }
    } catch (err) {
      toast.error(err);
    } finally {
      setIsloading(false);
    }
  };

  // const generateCertificate = async (course) => {
  //   setIsloading(true);
  //   try {
  //     const resp = await fetch("/api/generate-certificate", {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         courseId: course.courseId,
  //         courseName: course.courseName,
  //         userName: user.firstName + " " + user.lastName,
  //       }),
  //     });

  //     const blob = await resp.blob();
  //     const url = window.URL.createObjectURL(blob);

  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = `certificate-${course.courseName}.pdf`;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);

  //     toast.success("Certificate generated successfully!");
  //     return;
  //   } catch (err) {
  //     console.error("Error", err);
  //     toast.error(err);
  //   } finally {
  //     setIsloading(false);
  //   }
  // };

  return (
    <div className="dashboard__content">
      <section className="page-title-dashboard">
        <div className="themes-container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="title-dashboard">
                <div className="title-dash flex2">Courses</div>
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
        <section className="flat-dashboard-resumes flat-dashboard-setting">
          <div className="themes-container_main">
            <div className="tf-tab">
              <div className="row">
                <div className="col-lg-12 col-md-12 ">
                  <div className="wrap-profile instruction bg-white">
                    <div className="instruction_container  flex2 flex46">
                      <div className="group-title md:col-12 col-lg-9">
                        <h3 className="fw-6 color-3">Getting Started</h3>
                        <p className="mt-2">
                          If you are not enrolled in any course, you'll receive a confirmation email
                          with credentials to access your enrolled courses. Use the Moodle portal
                          link to access your enrolled courses.
                        </p>
                      </div>
                      <div className="moodlePortal2 md:col-12 col-lg-3">
                        <div className="tt-button1 tt-button tt-button2  moodlePortal ">
                          <Link href={"https://alpinumtraining.moodlecloud.com/"} target="_blank">
                            Visit Moodle Portal
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ----- */}
                  <div className="profile-setting bg-white">
                    <div className="wrap-testimonials over-flow-hidden tf-tab">
                      <div className="tf-container">
                        <div className="tf-title style-2">
                          <div className="group-title">
                            <h1>Available Courses</h1>
                            {allCourses?.length > 0 && <p>Find the right course for you</p>}
                          </div>
                        </div>

                        {allCourses?.length > 0 ? (
                          <div className="row content-tab wow fadeInUp jobs-tab">
                            <div className="swiper jobs-slider">
                              <div className="swiper-wrapper style-1">
                                <div className="swiper-slide">
                                  <div className="row">
                                    {allCourses?.map((course, i) => {
                                      const completionPercent = getCompletionPercentage(
                                        course?.courseId
                                      );
                                      return (
                                        <div key={i} className="col-lg-6">
                                          <div className="features-job">
                                            <div className="job-archive-header">
                                              <div className="box-content">
                                                <h4>
                                                  <Link href={"#"}>Tokens Required: 50</Link>
                                                </h4>
                                                <h3>
                                                  <Link
                                                    href={`https://alpinumtraining.moodlecloud.com/course/view.php?id=${course.courseId}`}
                                                    target="_blank"
                                                  >
                                                    {course?.courseName}
                                                  </Link>
                                                </h3>
                                                <ul>
                                                  <li>
                                                    <span className="icon-calendar" /> Start Date:{" "}
                                                    {new Date(
                                                      course?.startDate
                                                    ).toLocaleDateString() || ""}
                                                  </li>
                                                </ul>
                                                <ul>
                                                  <li>
                                                    <span className="icon-calendar" /> Ending Date:{" "}
                                                    {new Date(
                                                      course?.endDate
                                                    ).toLocaleDateString() || ""}
                                                  </li>
                                                </ul>
                                              </div>
                                            </div>
                                            <div className="job-archive-footer">
                                              {/* <div className="job-footer-left">
                                                {isUserEnrolled(course.courseId) && (
                                                  <h4
                                                    style={{
                                                      fontWeight: "bold",
                                                    }}
                                                  >
                                                    Progress
                                                  </h4>
                                                )}
                                                <div className="star">
                                                  {isUserEnrolled(course.courseId) && (
                                                    <h4
                                                      style={{
                                                        color: "#F47920",
                                                      }}
                                                    >
                                                      {completionPercent}% Completed
                                                    </h4>
                                                  )}
                                                </div>
                                              </div>

                                              {isUserEnrolled(course.courseId) && (
                                                <div
                                                  className="progress-bar-container"
                                                  style={{ marginTop: "-10px" }}
                                                >
                                                  <div
                                                    className="progress-bar-fill"
                                                    style={{
                                                      width: `${completionPercent}%`,
                                                    }}
                                                  />
                                                </div>
                                              )}

                                              <div
                                                style={{
                                                  marginTop: "25px",
                                                  borderBottom: "1px solid #e5e5e5",
                                                }}
                                              ></div> */}

                                              <div className="job-footer-right"></div>
                                              <div className="wd-form-login ">
                                                {/* <div className="col-12 col-md-6">
                                                  <button
                                                    onClick={() => generateCertificate(course)}
                                                  >
                                                    Get Certificate
                                                  </button>
                                                </div> */}
                                                {/* {isUserEnrolled(course.courseId) ? (
                                                  <div className="row">
                                                    <div className="col-12 col-md-6">
                                                      <button
                                                        onClick={() => handleSubmit(course)}
                                                        className={
                                                          isUserEnrolled(course.courseId)
                                                            ? "enrolled-btn"
                                                            : ""
                                                        }
                                                        disabled={isUserEnrolled(course.courseId)}
                                                      >
                                                        {isUserEnrolled(course.courseId) &&
                                                          "Get Certificate"}
                                                      </button>
                                                    </div>
                                                    <div className="col-12 col-md-6">
                                                      <button
                                                        target="_blank"
                                                        onClick={() =>
                                                          window.open(
                                                            `https://alpinumtraining.moodlecloud.com/course/view.php?id=${course.courseId}`,
                                                            "_blank"
                                                          )
                                                        }
                                                      >
                                                        View Activity
                                                      </button>
                                                    </div>
                                                  </div>
                                                ) : ( */}
                                                <button
                                                  onClick={() => handleSubmit(course)}
                                                  className={
                                                    isUserEnrolled(course.courseId)
                                                      ? "enrolled-btn"
                                                      : ""
                                                  }
                                                  disabled={isUserEnrolled(course.courseId)}
                                                >
                                                  {isUserEnrolled(course.courseId)
                                                    ? "Enrolled"
                                                    : "Enroll Now"}
                                                </button>
                                                {/* )} */}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                              <div className="swiper-pagination tes-bullet style-1" />
                            </div>
                          </div>
                        ) : (
                          <div className="row content-tab wow fadeInUp jobs-tab">
                            <div className="swiper jobs-slider">
                              <div className="swiper-wrapper style-1">
                                <div
                                  className="swiper-slide"
                                  style={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  <p>No courses available at the moment.</p>
                                  <br />
                                  <p>Please Try again</p>
                                </div>
                              </div>
                              <div className="swiper-pagination tes-bullet style-1" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Courses;
