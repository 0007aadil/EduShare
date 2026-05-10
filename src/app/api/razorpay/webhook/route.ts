import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const bodyText = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  // Verify signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(bodyText)
    .digest("hex");

  if (expectedSignature !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    const event = JSON.parse(bodyText);

    switch (event.event) {
      case "subscription.charged":
      case "subscription.authenticated": {
        const subscription = event.payload.subscription.entity;
        const userId = subscription.notes?.userId;
        const customerId = subscription.customer_id;
        const subscriptionId = subscription.id;
        const planId = subscription.plan_id;

        if (!userId) break;

        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            razorpayCustomerId: customerId,
            razorpaySubscriptionId: subscriptionId,
            razorpayPlanId: planId,
            currentPeriodEnd: new Date(subscription.current_end * 1000),
          },
          update: {
            razorpaySubscriptionId: subscriptionId,
            razorpayPlanId: planId,
            currentPeriodEnd: new Date(subscription.current_end * 1000),
          },
        });

        await prisma.user.update({
          where: { id: userId },
          data: { tier: "PRO" },
        });

        await prisma.activityLog.create({
          data: {
            userId,
            action: "SUBSCRIPTION_CREATED",
            details: "User upgraded to PRO via Razorpay",
          },
        });

        break;
      }

      case "subscription.cancelled": {
        const subscription = event.payload.subscription.entity;
        const dbSub = await prisma.subscription.findUnique({
          where: { razorpaySubscriptionId: subscription.id },
        });

        if (!dbSub) break;

        await prisma.subscription.update({
          where: { razorpaySubscriptionId: subscription.id },
          data: {
            currentPeriodEnd: new Date(subscription.current_end * 1000),
          },
        });

        await prisma.user.update({
          where: { id: dbSub.userId },
          data: { tier: "FREE" },
        });

        await prisma.activityLog.create({
          data: {
            userId: dbSub.userId,
            action: "SUBSCRIPTION_CANCELED",
            details: "User downgraded to FREE",
          },
        });
        
        break;
      }
    }
  } catch (error) {
    console.error("Razorpay Webhook processing error:", error);
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }

  return NextResponse.json({ status: "ok" });
}
