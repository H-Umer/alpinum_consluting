"use client";

import { useEffect, useRef, useState } from "react";
const optionsDefault = ["Newest", "Oldest", "3 days"];

export default function DropdownSelect2({
  onChange = (elm) => {},
  options = optionsDefault,
  defaultOption,
  selectedValue,
  addtionalParentClass = "",
  label = "",
}) {
  const selectRef = useRef();
  const optionsRef = useRef();
  const [selected, setSelected] = useState("");
  const toggleDropdown = () => {
    selectRef.current.classList.toggle("open");
  };

  return (
    <div
      className="dropdown titles-dropdown"
      onMouseEnter={() => selectRef.current.classList.add("show")}
      onMouseLeave={() => selectRef.current.classList.remove("show")}
    >
      {label ? <label className="title-user fw-7">{label}</label> : ""}
      <a className="btn-selector nolink">
        {" "}
        {selectedValue || selected || defaultOption || options[0]}
      </a>
      <ul ref={selectRef}>
        {options.map((elm, i) => (
          <li
            key={i}
            onClick={() => {
              setSelected(elm);
              onChange(elm);
              toggleDropdown();
            }}
            className={`option ${
              !selectedValue
                ? selected == elm
                  ? "active"
                  : ""
                : selectedValue == elm
                ? "active"
                : ""
            }  `}
          >
            <span>{elm}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
