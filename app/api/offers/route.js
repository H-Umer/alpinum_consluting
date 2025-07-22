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

    const { userId } = tokenDetails;

    if (!tokenDetails) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    const offers = await prisma.jobContract.findMany({
      where: {
        contractorId: userId,
      },
      include: {
        company: {
          include: {
            companyProfile: true,
          },
        },
      },
    });

    if (!offers.length > 0) {
      return NextResponse.json(
        {
          error: "No Offers Found",
        },
        { status: 401 }
      );
    }
    return NextResponse.json(
      {
        message: "success",
        offers: offers,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "something went wrong, Please try again", error: error },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authtoken = request.headers.get("Authorization");
    const body = await request.json();

    if (!authtoken) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    const tokenDetails = verifyAuthToken(authtoken);

    if (!tokenDetails) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    const { offerId, companyId, contractorId, status } = body;

    if (contractorId !== tokenDetails.userId) {
      return NextResponse.json({ error: "Unauthorized Contractor" }, { status: 401 });
    }

    let contractStatus;
    if (status === "ACCEPTED") {
      contractStatus = "ACCEPTED";
    } else if (status === "REJECTED") {
      contractStatus = "REJECTED";
    }

    await prisma.jobContract.update({
      where: { id: offerId },
      data: {
        status: contractStatus,
      },
    });

    const contracts = await prisma.jobContract.findMany({
      where: {
        contractorId: tokenDetails.userId,
      },
      include: {
        company: {
          include: {
            companyProfile: true,
          },
        },
      },
    });

    return NextResponse.json({
      status: "success",
      offers: contracts,
    });
  } catch (error) {
    console.error("error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
