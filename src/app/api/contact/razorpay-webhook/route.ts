import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("Webhook received:", body);

    const event = body.event;

    if (
      event !== "payment.captured" &&
      event !== "payment.failed"
    ) {
      return NextResponse.json({ success: true });
    }

    const payment = body.payload.payment.entity;

    const email = payment.email;
    const paymentId = payment.id;

    const paymentDate = new Date(
      payment.created_at * 1000
    ).toISOString();

    const status =
      event === "payment.captured"
        ? "Success"
        : "Failed";

    await fetch(
      "https://script.google.com/macros/s/AKfycbxprVV2yPvLVjJRhr5vzemvsbnSGNlL2356oG7GZXHHieplKys4AGuI1JOWjUWCpgGL/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "paymentUpdate",
          email,
          paymentId,
          paymentDate,
          status,
        }),
      }
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}