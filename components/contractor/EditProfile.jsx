"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Loader from "../loader/loader";
import { toast } from "react-toastify";
import Select from "react-select";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function EditProfile() {
  const router = useRouter();
  const token = useSelector((state) => state.currentUser.token);
  const [cvInfo, setCvInfo] = useState(null);
  const [myInfo, setMyInfo] = useState(null);
  const [resumeDoc, setResumeDoc] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLink, setSocialLink] = useState({
    github: "",
    twitter: "",
    linkedIn: "",
  });

  useEffect(() => {
    if (token) {
      fetchCvInfo();
    }
  }, [token]);

  const programmingLanguagesOptions = [
    { value: "ABAP", label: "ABAP" },
    { value: "ActionScript", label: "ActionScript" },
    { value: "Ada", label: "Ada" },
    { value: "Apex", label: "Apex" },
    { value: "APL", label: "APL" },
    { value: "Assembly", label: "Assembly" },
    { value: "Ballerina", label: "Ballerina" },
    { value: "Bash", label: "Bash" },
    { value: "BASIC", label: "BASIC" },
    { value: "C", label: "C" },
    { value: "C#", label: "C#" },
    { value: "C++", label: "C++" },
    { value: "Clojure", label: "Clojure" },
    { value: "COBOL", label: "COBOL" },
    { value: "CoffeeScript", label: "CoffeeScript" },
    { value: "Common Lisp", label: "Common Lisp" },
    { value: "Crystal", label: "Crystal" },
    { value: "D", label: "D" },
    { value: "Dart", label: "Dart" },
    { value: "Delphi", label: "Delphi" },
    { value: "Elixir", label: "Elixir" },
    { value: "Elm", label: "Elm" },
    { value: "Erlang", label: "Erlang" },
    { value: "F#", label: "F#" },
    { value: "Fortran", label: "Fortran" },
    { value: "Go", label: "Go" },
    { value: "Groovy", label: "Groovy" },
    { value: "Haskell", label: "Haskell" },
    { value: "HTML/CSS", label: "HTML/CSS" },
    { value: "Java", label: "Java" },
    { value: "JavaScript", label: "JavaScript" },
    { value: "Julia", label: "Julia" },
    { value: "Kotlin", label: "Kotlin" },
    { value: "LabVIEW", label: "LabVIEW" },
    { value: "Ladder Logic", label: "Ladder Logic" },
    { value: "Lisp", label: "Lisp" },
    { value: "Logo", label: "Logo" },
    { value: "Lua", label: "Lua" },
    { value: "MATLAB", label: "MATLAB" },
    { value: "Nim", label: "Nim" },
    { value: "Objective-C", label: "Objective-C" },
    { value: "OCaml", label: "OCaml" },
    { value: "Pascal", label: "Pascal" },
    { value: "Perl", label: "Perl" },
    { value: "PHP", label: "PHP" },
    { value: "PL/SQL", label: "PL/SQL" },
    { value: "PowerShell", label: "PowerShell" },
    { value: "Prolog", label: "Prolog" },
    { value: "Python", label: "Python" },
    { value: "R", label: "R" },
    { value: "Racket", label: "Racket" },
    { value: "Raku", label: "Raku" },
    { value: "REXX", label: "REXX" },
    { value: "Ruby", label: "Ruby" },
    { value: "Rust", label: "Rust" },
    { value: "SAS", label: "SAS" },
    { value: "Scala", label: "Scala" },
    { value: "Scheme", label: "Scheme" },
    { value: "Scratch", label: "Scratch" },
    { value: "Shell", label: "Shell" },
    { value: "Smalltalk", label: "Smalltalk" },
    { value: "Solidity", label: "Solidity" },
    { value: "SQL", label: "SQL" },
    { value: "Swift", label: "Swift" },
    { value: "Tcl", label: "Tcl" },
    { value: "TypeScript", label: "TypeScript" },
    { value: "VB.NET", label: "VB.NET" },
    { value: "Visual Basic", label: "Visual Basic" },
    { value: "WebAssembly", label: "WebAssembly" },
    { value: "VHDL", label: "VHDL" },
    { value: "Verilog", label: "Verilog" },
    { value: "Zig", label: "Zig" },
  ];

  const methodologiesOptions = [
    { value: "Agile", label: "Agile" },
    { value: "Scrum", label: "Scrum" },
    { value: "Kanban", label: "Kanban" },
    { value: "Lean", label: "Lean" },
    { value: "Waterfall", label: "Waterfall" },
    { value: "TDD", label: "TDD" },
    { value: "BDD", label: "BDD" },
    { value: "XP", label: "XP (Extreme Programming)" },
    { value: "FDD", label: "FDD (Feature-Driven Development)" },
    { value: "DSDM", label: "DSDM (Dynamic Systems Development Method)" },
    { value: "Crystal", label: "Crystal" },
    { value: "UVM", label: "UVM (Universal Verification Methodology)" },
    { value: "RUP", label: "RUP (Rational Unified Process)" },
    { value: "SAFe", label: "SAFe (Scaled Agile Framework)" },
    { value: "DevOps", label: "DevOps" },
    { value: "RAD", label: "RAD (Rapid Application Development)" },
    { value: "Spiral", label: "Spiral" },
    { value: "Prince2", label: "PRINCE2" },
    { value: "PMI/PMBOK", label: "PMI/PMBOK" },
    { value: "LeSS", label: "LeSS (Large-Scale Scrum)" },
    { value: "SixSigma", label: "Six Sigma" },
    { value: "Nexus", label: "Nexus" },
    { value: "Scrumban", label: "Scrumban" },
  ];

  const toolsOptions = [
    { value: "Cadence Simulator", label: "Cadence Simulator" },
    { value: "ModelSim", label: "ModelSim" },
    { value: "Vivado", label: "Vivado" },
    { value: "Quartus", label: "Quartus" },
    { value: "Synopsys", label: "Synopsys" },
    { value: "Altium Designer", label: "Altium Designer" },
    { value: "Xilinx ISE", label: "Xilinx ISE" },
    { value: "LTspice", label: "LTspice" },
    { value: "OrCAD", label: "OrCAD" },
    { value: "Mentor Graphics", label: "Mentor Graphics" },
    { value: "Verilog", label: "Verilog" },
    { value: "VHDL", label: "VHDL" },
    { value: "Proteus", label: "Proteus" },
    { value: "KiCad", label: "KiCad" },
    { value: "React", label: "React" },
    { value: "Angular", label: "Angular" },
    { value: "Vue.js", label: "Vue.js" },
    { value: "Node.js", label: "Node.js" },
    { value: "Laravel", label: "Laravel" },
    { value: "Django", label: "Django" },
    { value: "Flask", label: "Flask" },
    { value: "Spring Boot", label: "Spring Boot" },
    { value: "Express.js", label: "Express.js" },
    { value: "Ruby on Rails", label: "Ruby on Rails" },
    { value: "ASP.NET", label: "ASP.NET" },
    { value: "WordPress", label: "WordPress" },
    { value: "Gatsby", label: "Gatsby" },
    { value: "Next.js", label: "Next.js" },
    { value: "Svelte", label: "Svelte" },
    { value: "React Native", label: "React Native" },
    { value: "Flutter", label: "Flutter" },
    { value: "Swift/UIKit", label: "Swift/UIKit" },
    { value: "SwiftUI", label: "SwiftUI" },
    { value: "Kotlin/Android", label: "Kotlin/Android" },
    { value: "Xamarin", label: "Xamarin" },
    { value: "Ionic", label: "Ionic" },
    { value: "Visual Studio Code", label: "Visual Studio Code" },
    { value: "Visual Studio", label: "Visual Studio" },
    { value: "IntelliJ IDEA", label: "IntelliJ IDEA" },
    { value: "Eclipse", label: "Eclipse" },
    { value: "PyCharm", label: "PyCharm" },
    { value: "Android Studio", label: "Android Studio" },
    { value: "Xcode", label: "Xcode" },
    { value: "WebStorm", label: "WebStorm" },
    { value: "Sublime Text", label: "Sublime Text" },
    { value: "Vim", label: "Vim" },
    { value: "Emacs", label: "Emacs" },
    { value: "Atom", label: "Atom" },
    { value: "Docker", label: "Docker" },
    { value: "Kubernetes", label: "Kubernetes" },
    { value: "Jenkins", label: "Jenkins" },
    { value: "GitHub Actions", label: "GitHub Actions" },
    { value: "GitLab CI/CD", label: "GitLab CI/CD" },
    { value: "Travis CI", label: "Travis CI" },
    { value: "CircleCI", label: "CircleCI" },
    { value: "Terraform", label: "Terraform" },
    { value: "Ansible", label: "Ansible" },
    { value: "Puppet", label: "Puppet" },
    { value: "Chef", label: "Chef" },
    { value: "AWS", label: "AWS" },
    { value: "Azure", label: "Azure" },
    { value: "GCP", label: "GCP" },
    { value: "Heroku", label: "Heroku" },
    { value: "Vercel", label: "Vercel" },
    { value: "Netlify", label: "Netlify" },
    { value: "MySQL", label: "MySQL" },
    { value: "PostgreSQL", label: "PostgreSQL" },
    { value: "MongoDB", label: "MongoDB" },
    { value: "Redis", label: "Redis" },
    { value: "SQL Server", label: "SQL Server" },
    { value: "Oracle", label: "Oracle" },
    { value: "SQLite", label: "SQLite" },
    { value: "Firebase", label: "Firebase" },
    { value: "DynamoDB", label: "DynamoDB" },
    { value: "Cassandra", label: "Cassandra" },
    { value: "Jest", label: "Jest" },
    { value: "Mocha", label: "Mocha" },
    { value: "Selenium", label: "Selenium" },
    { value: "Cypress", label: "Cypress" },
    { value: "JUnit", label: "JUnit" },
    { value: "TestNG", label: "TestNG" },
    { value: "Pytest", label: "Pytest" },
    { value: "Postman", label: "Postman" },
    { value: "SoapUI", label: "SoapUI" },
    { value: "Swagger", label: "Swagger" },
    { value: "Figma", label: "Figma" },
    { value: "Sketch", label: "Sketch" },
    { value: "Adobe XD", label: "Adobe XD" },
    { value: "Photoshop", label: "Photoshop" },
    { value: "Illustrator", label: "Illustrator" },
    { value: "InDesign", label: "InDesign" },
    { value: "Zeplin", label: "Zeplin" },
    { value: "InVision", label: "InVision" },
    { value: "Jira", label: "Jira" },
    { value: "Trello", label: "Trello" },
    { value: "Asana", label: "Asana" },
    { value: "Confluence", label: "Confluence" },
    { value: "Monday.com", label: "Monday.com" },
    { value: "ClickUp", label: "ClickUp" },
    { value: "Microsoft Project", label: "Microsoft Project" },
    { value: "Basecamp", label: "Basecamp" },
    { value: "Notion", label: "Notion" },
  ];

  const AvailabilityDays = [
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
    { value: "Sunday", label: "Sunday" },
  ];

  const selectedTools = [
    ...(cvInfo?.tools || []),
    ...(cvInfo?.CV?.tools ? cvInfo.CV.tools.split(",").map((t) => t.trim()) : []),
  ];

  const handleToolsChange = (selectedOptions) => {
    setCvInfo((prevData) => ({
      ...prevData,
      tools: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    }));
  };

  const handleAvailabilityDays = (selectedOptions) => {
    setCvInfo((prevData) => ({
      ...prevData,
      availabilityDays: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    }));
  };

  const handleProgrammingLanguagesChange = (selectedOptions) => {
    setCvInfo((prevData) => ({
      ...prevData,
      languages: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    }));
  };

  const selectedMethodologies = [
    ...(cvInfo?.methodologies || []),
    ...(cvInfo?.CV?.methodologies ? cvInfo.CV.methodologies.split(",").map((m) => m.trim()) : []),
  ];

  const handleMethodologiesChange = (selectedOptions) => {
    setCvInfo((prevData) => ({
      ...prevData,
      methodologies: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    }));
  };

  const fetchCvInfo = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/contractor-profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (!response.ok) {
        return toast.error(result.error || "Oops! Something Went Wrong!");
      }
      if (response.status === 200) {
        setMyInfo(result.user);
        setCvInfo(result.CV);
        setResumeDoc(result.UserResume);

        const twitter = result?.CV?.socialLink?.find((el) => el.platform === "twitter");
        const linkedIn = result?.CV?.socialLink?.find((el) => el?.platform === "linkedIn");

        const github = result?.CV?.socialLink?.find((el) => el?.platform === "github");
        setSocialLink((prev) => ({
          ...prev,
          twitter: twitter?.url || "",
          github: github?.url || "",
          linkedIn: linkedIn?.url || "",
        }));
        return;
      }
      if (response.status === 404) {
        return toast.error(result.message);
      }
    } catch (err) {
      toast.error("err", err.message);
      console.error("err", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlsubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const obj = {
        user: { ...myInfo },
        CV: { ...cvInfo },
        socialLinks: {
          ...socialLink,
        },
      };

      formData.append("data", JSON.stringify(obj));

      const response = await fetch("/api/contractor-profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Oops! Something Went Wrong!");
      }

      const twitter = result?.CV?.socialLink?.find((el) => el?.platform === "twitter");
      const github = result?.CV?.socialLink?.find((el) => el?.platform === "github");
      const linkedIn = result?.CV?.socialLink?.find((el) => el?.platform === "linkedIn");

      setSocialLink((prev) => ({
        ...prev,
        twitter: twitter?.url || "",
        github: github?.url || "",
        linkedIn: linkedIn?.url || "",
      }));

      if (response.status === 201) {
        router.push("/contractor/profile-overview");
      }
      setMyInfo(result.user);
      setCvInfo(result.CV);
    } catch (err) {
      console.error("err", err.message);
      toast.error("err", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadResume = () => {
    setIsLoading(true);
    router.push("/contractor/resume");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image Size Should Be Less Than 5MB!");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please Upload An Image File!");
        return;
      }

      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="dashboard__content">
      <section className="page-title-dashboard">
        <div className="themes-container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="title-dashboard">
                <div className="title-dash flex2">Edit Profile</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="flat-dashboard-setting flat-dashboard-setting2">
        <div className="themes-container">
          {isLoading && (
            <div className="flex59">
              <Loader />
            </div>
          )}
          {!isLoading &&
            (resumeDoc?.fileUrl ? (
              <form onSubmit={handlsubmit}>
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="profile-setting bg-white">
                      <div className="form-infor-profile">
                        <h3 className="title-info">General Information</h3>

                        <div className="profile-image-upload" style={{ marginBottom: "30px" }}>
                          <div
                            className="image-upload-container"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "20px",
                            }}
                          >
                            <div>
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
                                  previewUrl ||
                                  cvInfo?.imageUrl ||
                                  "/images/profile/placeholder.jpg"
                                }
                                width={120}
                                height={120}
                              />
                            </div>
                            <div className="upload-controls" style={{ flex: 1 }}>
                              <label className="title-user fw-7">Profile Picture</label>
                              <div style={{ marginTop: "8px" }}>
                                <input
                                  type="file"
                                  accept="image/jpeg, image/png"
                                  onChange={handleImageChange}
                                  style={{ display: "none" }}
                                  id="profile-image-input"
                                />
                                <label
                                  htmlFor="profile-image-input"
                                  style={{
                                    padding: "10px 16px",
                                    backgroundColor: "#f47920",
                                    color: "white",
                                    borderRadius: "4px",
                                    fontWeight: "600",
                                    fontSize: "14px",
                                    cursor: "pointer",
                                    display: "inline-block",
                                  }}
                                >
                                  Choose Image
                                </label>
                                <small
                                  style={{
                                    display: "block",
                                    marginTop: "8px",
                                    color: "#666",
                                  }}
                                >
                                  Maximum file size: 5MB. Supported formats: JPG, PNG
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="form-infor flex flat-form ">
                          <div className="info-box info-wd">
                            <fieldset>
                              <label className="title-user fw-7">First Name</label>
                              <input
                                type="text"
                                id="FirstName"
                                name="FirstName"
                                value={myInfo?.firstName}
                                onChange={(e) =>
                                  setMyInfo({
                                    ...myInfo,
                                    firstName: e.target.value,
                                  })
                                }
                                className="input-form2"
                                placeholder="Enter your first name"
                              />
                            </fieldset>

                            <fieldset>
                              <label className="title-user fw-7">Designation</label>
                              <input
                                type="text"
                                id="designation"
                                name="designation"
                                className="input-form2"
                                placeholder="Enter your designation"
                                onChange={(e) =>
                                  setCvInfo({
                                    ...cvInfo,
                                    designation: e.target.value,
                                  })
                                }
                                value={cvInfo?.designation || ""}
                              />
                            </fieldset>

                            <fieldset>
                              <label className="title-user fw-7">
                                Maximum Working Days in Office
                              </label>
                              <input
                                type="number"
                                className="input-form2"
                                placeholder="Enter maximum working days in office"
                                id="onSiteWorkDays"
                                min={0}
                                max={5}
                                name="onSiteWorkDays"
                                value={cvInfo?.onSiteWorkDays || ""}
                                onChange={(e) => {
                                  const inputValue = Number(e.target.value);
                                  const newValue = Math.min(Math.max(inputValue, 0), 5);
                                  setCvInfo({
                                    ...cvInfo,
                                    onSiteWorkDays: newValue,
                                  });
                                }}
                              />
                            </fieldset>

                            <fieldset>
                              <label className="title-user fw-7">Programming Language</label>

                              <Select
                                isMulti
                                name="programmingLanguages"
                                options={programmingLanguagesOptions}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                value={programmingLanguagesOptions.filter((opt) =>
                                  [
                                    ...(cvInfo?.languages || []),
                                    ...(cvInfo?.CV?.languages
                                      ? cvInfo.CV.languages.split(",")
                                      : []),
                                  ].includes(opt.value)
                                )}
                                onChange={handleProgrammingLanguagesChange}
                                placeholder="Choose your languages"
                              />
                            </fieldset>

                            <fieldset>
                              <label className="title-user fw-7">Methodologies</label>
                              <Select
                                isMulti
                                name="methodologies"
                                options={methodologiesOptions}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                value={methodologiesOptions.filter((opt) =>
                                  selectedMethodologies.includes(opt.value)
                                )}
                                onChange={handleMethodologiesChange}
                                placeholder="Choose your methodologies"
                              />
                            </fieldset>
                          </div>
                          <div className="info-box info-wd">
                            <fieldset>
                              <label className="title-user fw-7">Last Name</label>
                              <input
                                type="text"
                                className="input-form2"
                                placeholder="Enter your last name"
                                id="lastName"
                                name="lastName"
                                onChange={(e) =>
                                  setMyInfo({
                                    ...myInfo,
                                    lastName: e.target.value,
                                  })
                                }
                                value={myInfo?.lastName}
                              />
                            </fieldset>

                            <fieldset>
                              <label className="title-user fw-7">Expected Rate Per Hour</label>
                              <input
                                type="number"
                                id="hrRate"
                                name="hrRate"
                                value={cvInfo?.hourlyRate}
                                className="input-form2"
                                placeholder="Enter expected rate per hour"
                                onChange={(e) => {
                                  const inputValue = Number(e.target.value);
                                  const newValue = Math.min(Math.max(inputValue, 0), 200);
                                  setCvInfo({
                                    ...cvInfo,
                                    hourlyRate: newValue,
                                  });
                                }}
                              />
                            </fieldset>

                            <fieldset>
                              <label className="title-user fw-7">Years of Experience</label>
                              <input
                                type="number"
                                className="input-form2"
                                placeholder="Enter years of experience"
                                id="experience"
                                min={0}
                                max={50}
                                name="experience"
                                value={cvInfo?.yearsExperience || ""}
                                onChange={(e) => {
                                  const inputValue = Number(e.target.value);
                                  const newValue = Math.min(Math.max(inputValue, 0), 50);
                                  setCvInfo({
                                    ...cvInfo,
                                    yearsExperience: newValue,
                                  });
                                }}
                              />
                            </fieldset>
                            {cvInfo?.experience > 50 && (
                              <small className="text-danger">Max 50 years allowed.</small>
                            )}

                            <fieldset>
                              <label className="title-user fw-7">Tools</label>
                              <Select
                                isMulti
                                name="tools"
                                options={toolsOptions}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                value={toolsOptions.filter((opt) =>
                                  selectedTools.includes(opt.value)
                                )}
                                onChange={handleToolsChange}
                                placeholder="Choose your tools"
                              />
                            </fieldset>

                            <fieldset>
                              <label className="title-user fw-7">Availability Days</label>
                              <Select
                                isMulti
                                name="AvailabilityDays"
                                options={AvailabilityDays}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                value={AvailabilityDays.filter((opt) =>
                                  (cvInfo.availabilityDays || []).includes(opt.value)
                                )}
                                onChange={handleAvailabilityDays}
                                placeholder="Choose your Availability Days"
                              />
                            </fieldset>
                          </div>
                        </div>

                        <div
                          className="social-wrap info-wd border-bt mt-10 border-t"
                          style={{
                            marginTop: "25px",
                            borderTop: "1px solid #e5e5e5",
                            paddingTop: "30px",
                          }}
                        >
                          <h3>Schedule Availability</h3>

                          <div className="form-social form-wg flex flat-form">
                            <div className="form-box wg-box">
                              <fieldset>
                                <label className="form-label fs-16 fw-7">Available From</label>

                                <div className="border date-input-parent">
                                  <DatePicker
                                    required
                                    className="date-input border-0 date-style w-full"
                                    type="text"
                                    name="Starttime"
                                    id="Starttime"
                                    selected={
                                      typeof cvInfo?.startTime === "string"
                                        ? new Date(
                                            `1970-01-01T${
                                              cvInfo.startTime.length === 7
                                                ? "0" + cvInfo.startTime
                                                : cvInfo.startTime
                                            }`
                                          )
                                        : cvInfo?.startTime || null
                                    }
                                    placeholder="Enter your Availability Time"
                                    onChange={(time) =>
                                      setCvInfo({
                                        ...cvInfo,
                                        startTime: time,
                                      })
                                    }
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={30}
                                    timeCaption="Time"
                                    dateFormat="h:mm aa"
                                    placeholderText="Select start time"
                                  />
                                </div>
                              </fieldset>
                            </div>
                            <div className="form-box wg-box">
                              <fieldset>
                                <label className="form-label fs-16 fw-7">Available To</label>

                                <div className="border date-input-parent">
                                  <DatePicker
                                    required
                                    className="date-input border-0 date-style w-full"
                                    type="text"
                                    name="Endtime"
                                    id="Endtime"
                                    selected={
                                      typeof cvInfo?.endTime === "string"
                                        ? new Date(
                                            `1970-01-01T${
                                              cvInfo.endTime.length === 7
                                                ? "0" + cvInfo.endTime
                                                : cvInfo.endTime
                                            }`
                                          )
                                        : cvInfo?.endTime || null
                                    }
                                    placeholder="Enter your Availability Time"
                                    onChange={(time) =>
                                      setCvInfo({
                                        ...cvInfo,
                                        endTime: time,
                                      })
                                    }
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={30}
                                    timeCaption="Time"
                                    dateFormat="h:mm aa"
                                    placeholderText="Select start time"
                                  />
                                </div>
                              </fieldset>
                            </div>
                          </div>
                        </div>

                        <div
                          className="social-wrap border-bt"
                          style={{
                            marginTop: "10px",
                          }}
                        >
                          <h3>Social Networks</h3>
                          <div className="form-social form-wg flex flat-form">
                            <div className="form-box info-wd wg-box">
                              <fieldset className="flex2">
                                <span className="icon-facebook" />
                                <input
                                  type="text"
                                  id="github"
                                  name="github"
                                  placeholder="https://github.com"
                                  className="input-form2"
                                  value={socialLink?.github || ""}
                                  onChange={(e) => {
                                    setSocialLink({
                                      ...socialLink,
                                      github: e.target.value,
                                    });
                                  }}
                                />
                              </fieldset>
                            </div>
                            <div className="form-box info-wd wg-box">
                              <fieldset className="flex2">
                                <span className="icon-linkedin2" />
                                <input
                                  type="text"
                                  className="input-form2"
                                  placeholder="https://linkedin.com"
                                  id="linkedIn"
                                  name="linkedIn"
                                  value={socialLink?.linkedIn || ""}
                                  onChange={(e) => {
                                    setSocialLink({
                                      ...socialLink,
                                      linkedIn: e.target.value,
                                    });
                                  }}
                                />
                              </fieldset>
                            </div>
                            <div className="form-box info-wd wg-box">
                              <fieldset className="flex2">
                                <span className="icon-twitter" />
                                <input
                                  type="text"
                                  className="input-form2"
                                  id="twitter"
                                  name="twitter"
                                  placeholder="https://twitter.com"
                                  value={socialLink?.twitter || ""}
                                  onChange={(e) => {
                                    setSocialLink({
                                      ...socialLink,
                                      twitter: e.target.value,
                                    });
                                  }}
                                />
                              </fieldset>
                            </div>
                          </div>
                        </div>

                        <div className="contact-wrap  info-wd">
                          <h3>Location Information</h3>

                          <div className="form-social form-wg flex flat-form">
                            <div className="form-box wg-box">
                              <fieldset className="">
                                <label className="title-user fw-7">City</label>
                                <input
                                  type="text"
                                  className="input-form2"
                                  placeholder="Enter your city"
                                  id="city"
                                  name="city"
                                  value={cvInfo?.city || ""}
                                  onChange={(e) =>
                                    setCvInfo({
                                      ...cvInfo,
                                      city: e.target.value,
                                    })
                                  }
                                />
                              </fieldset>
                            </div>
                            <div className="form-box wg-box">
                              <fieldset className="">
                                <label className="title-user fw-7">Country</label>
                                <input
                                  type="text"
                                  id="country"
                                  name="country"
                                  value={cvInfo?.country || ""}
                                  className="input-form2"
                                  placeholder="Enter your country"
                                  onChange={(e) =>
                                    setCvInfo({
                                      ...cvInfo,
                                      country: e.target.value,
                                    })
                                  }
                                />
                              </fieldset>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-100 d-flex justify-content-end">
                        <div className="row mt-1  gap-3 wd-form-login wd-form-loginleft">
                          <button href="#" type="onsubmit" className="">
                            Save Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
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
                        <span style={{ color: "#FFA500", fontSize: "1.2em" }}>⚠️</span>
                        No Data Found
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      ></div>
                      <h4
                        style={{
                          paddingLeft: "35px",
                        }}
                      >
                        Please first Upload a CV / Resume to edit profile
                      </h4>
                    </div>
                    <div className="w-100 d-flex justify-content-center">
                      <div className="row mt-1  gap-3 wd-form-login wd-form-loginleft">
                        <button href="#" type="onsubmit" className="" onClick={handleUploadResume}>
                          Upload Resume
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
