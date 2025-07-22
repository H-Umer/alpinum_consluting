"use client";
import React, { useEffect, useState, useRef } from "react";
import Select from "react-select";

const ShowParseCV = ({
  parseCV,
  uploadedFiles,
  formData,
  onClose,
  token,
  setUpdatedCV,
  setIsLoading,
  onSuccess,
}) => {
  const modalRef = useRef(null);

  const [cvForm, setCVForm] = useState(() => {
    return parseCV
      ? JSON.parse(JSON.stringify(parseCV))
      : {
          designation: "",
          degreeInfo: { degree: "" },
          skills: {
            languages: [],
            tools: [],
            methodologies: [],
          },
        };
  });

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

  const [skillInputs, setSkillInputs] = useState({
    languages: parseCV?.skills?.languages?.join(", ") || "",
    tools: parseCV?.skills?.tools?.join(", ") || "",
    methodologies: parseCV?.skills?.methodologies?.join(", ") || "",
  });

  useEffect(() => {
    // Using dynamic import to avoid "document is not defined" error
    const loadModal = async () => {
      if (typeof window !== "undefined") {
        const { Modal } = await import("bootstrap");
        const modalElement = document.getElementById("parsedModal");
        if (!modalElement) return;

        // Store modal instance in ref for later use
        modalRef.current = new Modal(modalElement);
        modalRef.current.show();

        // Set up handler for when modal is hidden
        const handleHide = () => {
          // Clean up backdrop and call onClose
          document.body.classList.remove("modal-open");
          const backdrop = document.querySelector(".modal-backdrop");
          if (backdrop) {
            backdrop.parentNode.removeChild(backdrop);
          }
          onClose();
        };

        modalElement.addEventListener("hidden.bs.modal", handleHide);
        return () => {
          modalElement.removeEventListener("hidden.bs.modal", handleHide);
        };
      }
    };

    loadModal();

    // Cleanup function for when component unmounts
    return () => {
      if (modalRef.current) {
        modalRef.current.hide();

        // Ensure we remove backdrop and body classes
        document.body.classList.remove("modal-open");
        const backdrop = document.querySelector(".modal-backdrop");
        if (backdrop) {
          backdrop.parentNode.removeChild(backdrop);
        }
      }
    };
  }, [onClose]);

  // Handle closing the modal programmatically
  const handleCloseModal = () => {
    if (modalRef.current) {
      modalRef.current.hide();

      // Manually ensure backdrop and classes are removed
      document.body.classList.remove("modal-open");
      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop);
      }

      onClose();
    }
  };

  // Handle input changes for normal fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "designation") {
      setCVForm((prev) => ({
        ...prev,
        designation: value,
      }));
    } else if (name === "degreeInfo.degree") {
      setCVForm((prev) => ({
        ...prev,
        degreeInfo: {
          ...prev.degreeInfo,
          degree: value,
        },
      }));
    }
  };

  // Update the user object with the new form data
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      if (setIsLoading) {
        setIsLoading(true);
      }

      const updatedcvForm = {
        ...cvForm,
      };

      const objData = new FormData();
      objData.append("file", uploadedFiles.docx);

      if (setUpdatedCV) {
        setUpdatedCV(updatedcvForm);

        const cvInfo = {
          ...formData,
          ...updatedcvForm,
        };

        objData.append("cvInfo", JSON.stringify(cvInfo));

        const response = await fetch("/api/contractor-profile", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: objData,
        });

        if (response.status === 201) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error("error", error);
    } finally {
      handleCloseModal();
      if (setIsLoading) setIsLoading(false);
    }
  };

  return (
    <div
      className="modal fade"
      id="parsedModal"
      tabIndex="-1"
      aria-labelledby="parsedModalLabel"
      aria-hidden="true"
      style={{ marginTop: "40px", zIndex: "1060" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="modal-title fw-bold m-0" id="parsedModalLabel">
                Information From Resume
              </h5>
              <button
                type="button"
                // className="btn-close"
                className="primary"
                onClick={handleCloseModal}
                aria-label="Close"
              >
                close
              </button>
            </div>

            <form onSubmit={handleUpdate}>
              <div className="row g-3">
                <div className="col-md-12">
                  <div className="form-group mb-3">
                    <label htmlFor="designation" className="form-label fw-bold">
                      Designation
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="designation"
                      name="designation"
                      value={cvForm.designation || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Degree Info */}
                <div className="col-md-12">
                  <div className="form-group mb-3">
                    <label htmlFor="degreeInfo" className="form-label fw-bold">
                      Degree Info
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="degreeInfo"
                      name="degreeInfo.degree"
                      value={cvForm.degreeInfo?.degree || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-12">
                  <h3 className="border-bottom pb-2">Skills</h3>
                </div>
              </div>

              <div className="row g-3 mt-1">
                <div className="col-md-12">
                  <div className="form-group mb-2">
                    <label htmlFor="languages" className="form-label fw-bold">
                      Languages
                    </label>
                    <Select
                      isMulti
                      name="languages"
                      options={programmingLanguagesOptions}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      placeholder="Choose languages"
                      value={cvForm.skills.languages.map((val) => ({
                        label: val,
                        value: val,
                      }))}
                      onChange={(selectedOptions) => {
                        const values = selectedOptions.map((opt) => opt.value);
                        setCVForm((prev) => ({
                          ...prev,
                          skills: {
                            ...prev.skills,
                            languages: values,
                          },
                        }));
                        setSkillInputs((prev) => ({
                          ...prev,
                          languages: values.join(", "),
                        }));
                      }}
                    />
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="form-group mb-2">
                    <label htmlFor="tools" className="form-label fw-bold">
                      Tools
                    </label>
                    <Select
                      isMulti
                      name="tools"
                      options={toolsOptions}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      placeholder="Choose tools"
                      value={cvForm.skills.tools.map((el) => ({
                        label: el,
                        value: el,
                      }))}
                      onChange={(selectedOptions) => {
                        const values = selectedOptions.map((opt) => opt.value);
                        setCVForm((prev) => ({
                          ...prev,
                          skills: {
                            ...prev.skills,
                            tools: values,
                          },
                        }));
                        setSkillInputs((prev) => ({
                          ...prev,
                          tools: values.join(", "),
                        }));
                      }}
                    />
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="form-group mb-2">
                    <label
                      htmlFor="methodologies"
                      className="form-label fw-bold"
                    >
                      Methodologies
                    </label>
                    <Select
                      isMulti
                      name="methodologies"
                      options={methodologiesOptions}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      placeholder="Choose methodologies"
                      value={cvForm.skills.methodologies.map((el) => ({
                        label: el,
                        value: el,
                      }))}
                      onChange={(selectedOptions) => {
                        const values = selectedOptions.map((opt) => opt.value);
                        setCVForm((prev) => ({
                          ...prev,
                          skills: {
                            ...prev.skills,
                            methodologies: values,
                          },
                        }));
                        setSkillInputs((prev) => ({
                          ...prev,
                          methodologies: values.join(", "),
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="w-100 d-flex justify-content-end">
                <div className="row mt-1  gap-3 wd-form-login wd-form-loginleft">
                  <button type="onsubmit">Submit</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowParseCV;
