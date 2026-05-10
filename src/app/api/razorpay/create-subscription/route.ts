import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { razorpay, PLANS } from "@/lib/razorpay";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!PLANS.PRO.razorpayPlanId) {
      return NextResponse.json({ error: "Razorpay Plan ID not configured" }, { status: 500 });
    }

    // Create a subscription
    const subscription = await razorpay.subscriptions.create({
      plan_id: PLANS.PRO.razorpayPlanId,
      customer_notify: 1,
      total_count: 120, // Example: 10 years
      notes: {
        userId: (session.user as any).id,
      },
    });

    return NextResponse.json({ 
      subscriptionId: subscription.id,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error("Razorpay subscription error:", error);
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
  }
}
