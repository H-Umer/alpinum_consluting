import { NextResponse } from "next/server";
import prisma from "@/utils/prisma"; // Make sure this is the initialized client
import { verifyAuthToken } from "@/utils/verifyAuthToken";

export async function GET(request) {
  try {
    const authtoken = request.headers.get("Authorization");

    // Common data fetching functions
    const fetchCandidates = async () => {
      return await prisma.user.findMany({
        where: { role: "CONTRACTOR" },
        select: {
          firstName: true,
          lastName: true,
          id: true,
          role: true,
          email: true,
          contractorProfile: true,
          createdAt: true,
        },
      });
    };

    const fetchTeams = async () => {
      return await prisma.team.findMany({
        include: { members: true },
        orderBy: { createdAt: "desc" },
      });
    };

    // Fetch data based on authentication
    if (!authtoken) {
      const [candidates, teams] = await Promise.all([
        fetchCandidates(),
        fetchTeams(),
      ]);

      if (!teams || teams.length === 0) {
        return NextResponse.json(
          { message: "No teams found!" },
          { status: 404 }
        );
      }

      return NextResponse.json({ candidates, teams }, { status: 200 });
    }

    // Authenticated request
    const tokenDetails = verifyAuthToken(authtoken);
    if (!tokenDetails) {
      return NextResponse.json(
        { error: "Invalid Token!" },
        { status: 401 } // Changed to 401 for unauthorized
      );
    }

    const [candidates, teams] = await Promise.all([
      fetchCandidates(),
      fetchTeams(),
    ]);

    return NextResponse.json(
      {
        message: "Success!",
        candidates,
        teams: teams || [], // Ensure teams is always defined
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in GET /api/contractor/team:", err);
    return NextResponse.json(
      { message: "Internal server error", error: err.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// without teams

// import { NextResponse } from "next/server";
// import prisma from "@/utils/prisma"; // Make sure this is the initialized client
// import { verifyAuthToken } from "@/utils/verifyAuthToken";

// export async function GET(request) {
//   try {
//     // Ensure Prisma is connected
//     await prisma.$connect();

//     const authtoken =
//       request.headers.get("authorization") ||
//       request.headers.get("Authorization");

//     // Common data fetching function
//     const fetchCandidates = async () => {
//       return await prisma.user.findMany({
//         where: { role: "CONTRACTOR" },
//         select: {
//           firstName: true,
//           lastName: true,
//           id: true,
//           role: true,
//           email: true,
//           contractorProfile: true,
//           createdAt: true,
//         },
//       });
//     };

//     // Unauthenticated request
//     if (!authtoken) {
//       const candidates = await fetchCandidates();
//       return NextResponse.json({ candidates }, { status: 200 });
//     }

//     // Authenticated request
//     const tokenDetails = verifyAuthToken(authtoken);
//     if (!tokenDetails) {
//       return NextResponse.json(
//         { error: "Invalid Token!" },
//         { status: 401 } // Changed to 401 Unauthorized
//       );
//     }

//     const candidates = await fetchCandidates();
//     return NextResponse.json(
//       {
//         message: "Success!",
//         candidates,
//       },
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error("API Error:", err);
//     return NextResponse.json(
//       { error: "Internal server error", details: err.message },
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect().catch(() => {});
//   }
// }
