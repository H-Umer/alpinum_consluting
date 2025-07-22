"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useMemo } from "react";
import Loader from "@/components/loader/loader";
import { toast } from "react-toastify";
import Select from "react-select";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function CreateJobPost() {
  const router = useRouter();
  const token = useSelector((state) => state.currentUser.token);
  const [isLoading, setIsLoading] = useState(false);
  const descriptionEditor = useRef(null);
  const requirementsEditor = useRef(null);
  const config = useMemo(
    () => ({
      readonly: false,
    }),
    []
  );

  const [formData, setFormData] = useState({
    role: "",
    description: "",
    additionalRequirements: "",
    experience: 0,
    rate: 0,
    currency: "",
    location: "",
    availability: "",
    jobType: "",
    status: "ACTIVE",
    skills: [],
  });

  const skillsOptions = [
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

  const handleSkillsChange = (selectedOptions) => {
    setFormData((prevData) => ({
      ...prevData,
      skills: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    }));
  };

  const handlSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/company/job-posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      toast.success(result.message);
      router.push("/company/job-posts");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error);
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
                <div className="title-dash flex2">Create Job Post</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="flat-dashboard-setting flat-dashboard-setting2">
        <div className="themes-container">
          {isLoading ? (
            <div className="flex59">
              <Loader />
            </div>
          ) : (
            <div>
              <form onSubmit={handlSubmit}>
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="profile-setting bg-white">
                      <div className="form-infor-profile">
                        <h3 className="title-info">General Information</h3>

                        <div className="form-infor flat-form">
                          <div className="info-box-post info-wd">
                            <fieldset>
                              <label className="title-user fw-7">
                                Job Role <span className="required">*</span>
                              </label>
                              <input
                                type="text"
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    role: e.target.value,
                                  })
                                }
                                className="input-form2"
                                placeholder="Enter job role"
                                required
                              />
                            </fieldset>

                            <fieldset>
                              <label className="title-user fw-7">
                                Job Description <span className="required">*</span>
                              </label>

                              <JoditEditor
                                ref={descriptionEditor}
                                value={formData.description}
                                config={config}
                                tabIndex={1}
                                onChange={(newContent) => {
                                  setFormData({
                                    ...formData,
                                    description: newContent,
                                  });
                                }}
                                required
                              />
                            </fieldset>

                            <fieldset>
                              <label className="title-user fw-7">Additional Requirements</label>
                              <JoditEditor
                                ref={requirementsEditor}
                                value={formData.additionalRequirements}
                                config={config}
                                tabIndex={1}
                                onChange={(newContent) => {
                                  setFormData({
                                    ...formData,
                                    additionalRequirements: newContent,
                                  });
                                }}
                                required
                              />
                            </fieldset>

                            <fieldset>
                              <label className="title-user fw-7">
                                Years of Experience <span className="required">*</span>
                              </label>

                              <input
                                type="number"
                                className="input-form2"
                                placeholder="Enter required years of experience"
                                id="experience"
                                name="experience"
                                value={formData.experience || ""}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    experience: e.target.value,
                                  });
                                }}
                                required
                              />
                            </fieldset>

                            <div className="row">
                              <div className="col-lg-6 col-md-6">
                                <fieldset>
                                  <label className="title-user fw-7">
                                    Rate <span className="required">*</span>
                                  </label>

                                  <input
                                    type="number"
                                    className="input-form2"
                                    placeholder="Enter rate per hour"
                                    id="rate"
                                    name="rate"
                                    value={formData.rate || ""}
                                    onChange={(e) => {
                                      setFormData({
                                        ...formData,
                                        rate: e.target.value,
                                      });
                                    }}
                                    required
                                  />
                                </fieldset>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <fieldset>
                                  <label className="title-user fw-7">
                                    Currency <span className="required">*</span>
                                  </label>

                                  <select
                                    required
                                    id="currency"
                                    name="currency"
                                    className="input-form2"
                                    value={formData.currency}
                                    onChange={(e) => {
                                      setFormData({
                                        ...formData,
                                        currency: e.target.value,
                                      });
                                    }}
                                  >
                                    <option value="" className="input-form2">
                                      Select
                                    </option>
                                    <option value="USD">USD</option>
                                    <option value="GBP">GBP</option>
                                    <option value="EUR">EUR</option>
                                    <option value="INR">INR</option>
                                    <option value="AUD">AUD</option>
                                    <option value="CAD">CAD</option>
                                  </select>
                                </fieldset>
                              </div>
                            </div>

                            <div className="row">
                              <div className="col-lg-6 col-md-6">
                                <fieldset>
                                  <label className="title-user fw-7">
                                    Availability <span className="required">*</span>
                                  </label>
                                  <div className="border date-input-parent">
                                    <DatePicker
                                      required
                                      className="date-input border-0 date-style"
                                      selected={formData.availability}
                                      onChange={(date) =>
                                        setFormData({
                                          ...formData,
                                          availability: date
                                            ? new Intl.DateTimeFormat("en-US").format(date)
                                            : "null",
                                        })
                                      }
                                      minDate={new Date()}
                                      placeholderText="Select availability date"
                                      dateFormat="MM-dd-yyyy"
                                    />
                                  </div>
                                </fieldset>
                              </div>

                              <div className="col-lg-6 col-md-6">
                                <fieldset>
                                  <label className="title-user fw-7">
                                    Job Type <span className="required">*</span>
                                  </label>

                                  <select
                                    required
                                    id="jobType"
                                    name="jobType"
                                    className="input-form2"
                                    value={formData.jobType}
                                    onChange={(e) => {
                                      setFormData({
                                        ...formData,
                                        jobType: e.target.value,
                                      });
                                    }}
                                  >
                                    <option value="" className="input-form2">
                                      Select
                                    </option>
                                    <option value="FULL_TIME">Full Time</option>
                                    <option value="PART_TIME">Part Time</option>
                                    <option value="CONTRACT">Contract</option>
                                    <option value="FREELANCE">Freelance</option>
                                  </select>
                                </fieldset>
                              </div>
                            </div>

                            <fieldset>
                              <label className="title-user fw-7">
                                Job Location <span className="required">*</span>
                              </label>
                              <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                className="input-form2"
                                placeholder="Enter job location"
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    location: e.target.value,
                                  });
                                }}
                                required
                              />
                            </fieldset>
                          </div>
                        </div>

                        <div
                          className="contact-wrap info-wd"
                          style={{ marginTop: "40px", borderTop: "1px solid #e5e5e5" }}
                        >
                          <h3 style={{ marginTop: "20px" }}>Skills & Expertise Required</h3>

                          <div className="form-social flat-form">
                            <fieldset>
                              <label className="title-user fw-7">
                                Skills/Tools/Technologies <span className="required">*</span>
                              </label>

                              <Select
                                isMulti
                                name="skills"
                                options={skillsOptions}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                value={skillsOptions.filter((opt) =>
                                  formData?.skills?.includes(opt.value)
                                )}
                                onChange={handleSkillsChange}
                                placeholder="Choose skills/tools/technologies"
                                required
                              />
                            </fieldset>
                          </div>
                        </div>
                      </div>
                      <div className="w-100 d-flex justify-content-end">
                        <div className="row mt-1  gap-3 wd-form-login wd-form-loginleft">
                          <button href="#" type="onsubmit" style={{ marginTop: "-20px" }}>
                            Create
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
