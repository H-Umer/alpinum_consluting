const MOODLE_API_URL = process.env.MOODLE_API_URL;
const MOODLE_API_TOKEN = process.env.MOODLE_API_TOKEN;

export async function createMoodleAccount({
  username,
  password,
  firstname,
  lastname,
  email,
}) {
  const params = new URLSearchParams({
    wstoken: MOODLE_API_TOKEN,
    wsfunction: "core_user_create_users",
    moodlewsrestformat: "json",
    "users[0][username]": username,
    "users[0][password]": password,
    "users[0][firstname]": firstname,
    "users[0][lastname]": lastname,
    "users[0][email]": email,
  });

  const res = await fetch(`${MOODLE_API_URL}?${params.toString()}`, {
    method: "POST",
  });

  return res.json();
}

export async function enrolUserInCourse({ userId, courseId, roleId = 5 }) {
  try {
    const params = new URLSearchParams({
      wstoken: MOODLE_API_TOKEN,
      wsfunction: "enrol_manual_enrol_users",
      moodlewsrestformat: "json",
      "enrolments[0][roleid]": roleId,
      "enrolments[0][userid]": userId,
      "enrolments[0][courseid]": courseId,
    });

    const res = await fetch(`${MOODLE_API_URL}?${params.toString()}`, {
      method: "POST",
    });

    const data = await res.json();

    return {
      data: data,
      ok: res.ok,
      status: res.status,
    };
  } catch (err) {
    console.error("Error enrolling user in course:", err);
    return { status: 500, ok: false, error: err.message };
  }
}

export async function coursesStatus({ userId, courseId }) {
  try {
    const params = new URLSearchParams({
      wstoken: MOODLE_API_TOKEN,
      wsfunction: "core_completion_get_course_completion_status",
      moodlewsrestformat: "json",
      userid: userId,
      courseid: courseId,
    });

    const res = await fetch(`${MOODLE_API_URL}?${params.toString()}`, {
      method: "POST",
    });

    const data = await res.json();

    return {
      data: data,
      ok: res.ok,
      status: res.status,
    };
  } catch (err) {
    console.error("Error fetching courses:", err);
    return { status: 500, ok: false, error: err.message };
  }
}
