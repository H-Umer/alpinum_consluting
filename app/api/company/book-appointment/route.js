import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { verifyAuthToken } from "@/utils/verifyAuthToken";
import { generatingZoomMeeting } from "@/utils/generatingZoomMeeting";
import { zoomContractorEmail } from "@/utils/generateEmail/zoomContractorEmail";
import { zoomCompanyEmail } from "@/utils/generateEmail/zoomCompanyEmail";
import { zoomAdminEmail } from "@/utils/generateEmail/zoomAdminEmail";

const gmtOffsetToIana = {
  "GMT-1200": "Etc/GMT+12", // Baker Island Time
  "GMT-1100": "Pacific/Midway", // Samoa Standard Time
  "GMT-1000": "Pacific/Honolulu", // Hawaii-Aleutian Standard Time
  "GMT-0930": "Pacific/Marquesas", // Marquesas Islands
  "GMT-0900": "America/Anchorage", // Alaska Standard Time
  "GMT-0800": "America/Los_Angeles", // Pacific Standard Time (US & Canada)
  "GMT-0700": "America/Denver", // Mountain Standard Time (US & Canada)
  "GMT-0600": "America/Chicago", // Central Standard Time (US & Canada)
  "GMT-0500": "America/New_York", // Eastern Standard Time (US & Canada)
  "GMT-0430": "America/Caracas", // Venezuela Time
  "GMT-0400": "America/Santiago", // Atlantic Standard Time (Canada), Chile
  "GMT-0330": "America/St_Johns", // Newfoundland Standard Time
  "GMT-0300": "America/Argentina/Buenos_Aires", // Argentina
  "GMT-0200": "America/Noronha", // Fernando de Noronha
  "GMT-0100": "Atlantic/Azores", // Azores Standard Time
  "GMT+0000": "UTC", // Greenwich Mean Time
  "GMT+0100": "Europe/Berlin", // Central European Time
  "GMT+0200": "Europe/Helsinki", // Eastern European Time
  "GMT+0300": "Europe/Moscow", // Moscow Standard Time
  "GMT+0330": "Asia/Tehran", // Iran Standard Time
  "GMT+0400": "Asia/Dubai", // Gulf Standard Time
  "GMT+0430": "Asia/Kabul", // Afghanistan Time
  "GMT+0500": "Asia/Karachi", // Pakistan Standard Time
  "GMT+0530": "Asia/Kolkata", // India Standard Time
  "GMT+0545": "Asia/Kathmandu", // Nepal Time
  "GMT+0600": "Asia/Dhaka", // Bangladesh Standard Time
  "GMT+0630": "Asia/Yangon", // Myanmar Time
  "GMT+0700": "Asia/Bangkok", // Indochina Time
  "GMT+0800": "Asia/Singapore", // Singapore Standard Time / China Standard Time
  "GMT+0845": "Australia/Eucla", // Western Australia
  "GMT+0900": "Asia/Tokyo", // Japan Standard Time
  "GMT+0930": "Australia/Darwin", // Australian Central Standard Time
  "GMT+1000": "Australia/Sydney", // Australian Eastern Standard Time
  "GMT+1030": "Australia/Lord_Howe", // Lord Howe Standard Time
  "GMT+1100": "Pacific/Noumea", // New Caledonia
  "GMT+1200": "Pacific/Auckland", // New Zealand Standard Time
  "GMT+1245": "Pacific/Chatham", // Chatham Islands Time
  "GMT+1300": "Pacific/Tongatapu", // Tonga Time
  "GMT+1400": "Pacific/Kiritimati", // Line Islands Time
};

function convertToLocal(utcString, timezone) {
  return new Date(utcString).toLocaleString("en-US", {
    timeZone: timezone,
    dateStyle: "full",
    timeStyle: "short",
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      contractorId,
      contractorEmail,
      contractorName,
      appointmentDate,
      appointmentTime,
      contractorTimezone,
    } = body;

    if (!contractorId || !appointmentDate || !appointmentTime) {
      return NextResponse.json({ error: "All fields are required!" }, { status: 400 });
    }
    const authtoken = request.headers.get("Authorization");

    if (!authtoken) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    const tokenDetails = verifyAuthToken(authtoken);

    if (!tokenDetails) {
      return NextResponse.json({
        message: "Unauthorized!",
      });
    }

    const companyDetails = await prisma.companyProfile.findFirst({
      where: {
        userId: tokenDetails.id,
      },
    });

    const zoomTokenResponse = await generatingZoomMeeting(
      process.env.ZOOM_ACCOUNT_ID,
      process.env.ZOOM_CLIENT_ID,
      process.env.ZOOM_CLIENT_SECRET
    );

    const { access_token } = zoomTokenResponse;

    if (!access_token) {
      return NextResponse.json({ error: "Failed to generate Zoom access token." }, { status: 500 });
    }

    const contractorTimeZoneSet = contractorTimezone || "GMT+0000";

    const localDateTime = `${appointmentDate}T${appointmentTime}:00${contractorTimezone.replace(
      "GMT",
      ""
    )}`;
    const start_time = new Date(localDateTime).toISOString();

    const creatingZoomMeeting = await fetch("https://api.zoom.us/v2/users/me/meetings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: "Contractor Interview",
        type: 2,
        start_time: start_time,
        duration: 30,
        timezone: "UTC",
        agenda: `Interview with contractor ${contractorName}`,
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: true,
          mute_upon_entry: true,
          waiting_room: false,
        },
      }),
    });

    const zoomMeetingResult = await creatingZoomMeeting.json();

    const localCompanyStartTime = convertToLocal(
      zoomMeetingResult.start_time,
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );

    const contractorTimeZoneConvert = gmtOffsetToIana[contractorTimeZoneSet] || "UTC";

    const localContractorStartTime = convertToLocal(
      zoomMeetingResult.start_time,
      contractorTimeZoneConvert
    );

    const companyName = companyDetails.companyName;
    const companyEmail = tokenDetails.email;

    await zoomContractorEmail({
      name: contractorName,
      email: contractorEmail,
      meetingTitle: zoomMeetingResult?.topic,
      joinUrl: zoomMeetingResult?.join_url,
      password: zoomMeetingResult?.password,
      startTime: localContractorStartTime,
      companyName: companyName,
    });

    await zoomCompanyEmail({
      contractorName: contractorName,
      companyName: companyName,
      email: companyEmail,
      meetingTitle: zoomMeetingResult?.topic,
      startTime: localCompanyStartTime,
      password: zoomMeetingResult?.password,
      joinUrl: zoomMeetingResult?.join_url,
    });

    await zoomAdminEmail({
      contractorName: contractorName,
      companyName: companyName,
      startTime: localCompanyStartTime,
    });

    return NextResponse.json(
      {
        status: "success",
        message: "Interview Scheduled Successfully!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
