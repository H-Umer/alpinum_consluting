export const fetchContractors = async (token) => {
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
      throw new Error(result.message || "Failed to fetch contractors");
    }

    const filteredUsers = result.candidates.filter(
      (el) => !el.lastName.includes("Dummy")
    );

    // Map users into dropdown friendly format
    const formatted = filteredUsers.map((user) => ({
      value: user.id,
      label: `${user.firstName} ${user.lastName}`,
    }));
    console.log("qqqqqqqqqqqq--------Formatted contractors:", formatted);

    return formatted;
  } catch (error) {
    console.error("Error fetching contractors:", error.message);
    throw error;
  }
};
