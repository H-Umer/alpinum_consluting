export const generatingZoomMeeting = async (
  accountId,
  clientId,
  clientSecret
) => {
  const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );
  const resp = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`,

    {
      method: "POST",
      headers: {
        Authorization: `Basic ${authHeader}`,
        //   "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  if (!resp.ok) {
    throw new Error("Failed to obtain access token from Zoom");
  }

  const result = await resp.json();
  return result;
};
