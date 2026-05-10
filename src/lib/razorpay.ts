import Razorpay from "razorpay";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const PLANS = {
  FREE: {
    name: "Free",
    maxSubmissions: 5,
    maxBookmarks: 20,
    aiDigest: false,
    price: 0,
  },
  PRO: {
    name: "Pro",
    maxSubmissions: Infinity,
    maxBookmarks: Infinity,
    aiDigest: true,
    price: 900, // Typically in smallest currency unit (e.g., paise for INR or cents) but this is just display/logic
    razorpayPlanId: process.env.RAZORPAY_PRO_PLAN_ID,
  },
} as const;
