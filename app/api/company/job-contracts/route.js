import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { verifyAuthToken } from "@/utils/verifyAuthToken";

export async function GET(request) {
  try {
    const authtoken = request.headers.get("Authorization");

    if (!authtoken) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    const tokenDetails = verifyAuthToken(authtoken);

    if (!tokenDetails) {
      return NextResponse.json({ error: "UnAuthorized!" }, { status: 401 });
    }

    const allContracts = await prisma.jobContract.findMany({
      where: { companyId: tokenDetails.userId },
      include: {
        contractor: {
          include: {
            contractorProfile: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Success",
        contracts: allContracts,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
