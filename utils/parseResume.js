const parseResumeData = (text) => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  // const extractMainRole = () => {
  //   let startIdx = -1;

  //   for (let i = 0; i < lines.length; i++) {
  //     if (/mobile/i.test(lines[i])) {
  //       startIdx = i + 1;
  //       break;
  //     }
  //   }

  //   if (startIdx !== -1) {
  //     const nextLines = [];

  //     for (let i = startIdx; i < lines.length; i++) {
  //       if (lines[i].trim() !== "") {
  //         nextLines.push(lines[i].trim());
  //       }
  //       if (nextLines.length === 2) break;
  //     }

  //     if (nextLines.length >= 2) {
  //       return nextLines[1];
  //     }
  //   }

  //   return null;
  // };

  const extractMainRole = () => {
    return lines.length >= 2 ? lines[1] : null;
  };

  const extractDegreeInfo = () => {
    const eduIndex = lines.findIndex((line) => /educational qualification/i.test(line));

    if (eduIndex !== -1 && lines[eduIndex + 1]) {
      const degreeLine = lines[eduIndex + 1];

      const degreeMatch = degreeLine.match(
        /(?<degree>.+?)\s*–\s*(?<university>.+?)\s*\((?<startYear>\d{4})\s*[–-]\s*(?<endYear>\d{4})\)/i
      );

      if (degreeMatch?.groups) {
        const { degree, university, startYear, endYear } = degreeMatch.groups;

        const clean = (str) =>
          str
            .replace(/[-–—\s]+$/, "")
            .replace(/^[-–—\s]+/, "")
            .trim();

        return {
          degree: `${clean(degree)} – ${clean(university)} – (${startYear} - ${endYear})`,
        };
      }

      return {
        degree: degreeLine.trim(),
      };
    }

    return null;
  };

  const extractSkills = () => {
    const skills = { languages: [], tools: [], methodologies: [] };

    lines.forEach((line) => {
      if (/languages\s*:/i.test(line)) {
        const match = line.split(/languages\s*:/i)[1];
        if (match) {
          skills.languages = match
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean);
        }
      }

      if (/tools\s*:/i.test(line)) {
        const match = line.split(/tools\s*:/i)[1];
        if (match) {
          skills.tools = match
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean);
        }
      }

      if (/methodologies\s*:/i.test(line)) {
        const match = line.split(/methodologies\s*:/i)[1];
        if (match) {
          skills.methodologies = match
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean);
        }
      }
    });

    return skills;
  };

  return {
    designation: extractMainRole(),
    degreeInfo: extractDegreeInfo(),
    skills: extractSkills(),
  };
};

export { parseResumeData };
