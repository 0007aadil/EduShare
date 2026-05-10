"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { CheckCircle, X, Zap, Crown } from "lucide-react";
import toast from "react-hot-toast";

// Add Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load Razorpay script dynamically
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleUpgrade = async () => {
    if (!session) {
      router.push("/login?callbackUrl=/pricing");
      return;
    }

    setLoading(true);
    try {
      // Create subscription on our backend
      const res = await fetch("/api/razorpay/create-subscription", {
        method: "POST",
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate subscription");
      }

      // Initialize Razorpay checkout
      const options = {
        key: data.keyId,
        subscription_id: data.subscriptionId,
        name: "EduShare",
        description: "EduShare Pro Subscription",
        image: "https://your-logo-url.com/logo.png", // Replace with real logo
        handler: function (response: any) {
          // Razorpay returns razorpay_payment_id, razorpay_subscription_id, razorpay_signature
          toast.success("Payment successful! Your account is being upgraded.");
          setTimeout(() => router.push("/dashboard"), 2000);
        },
        prefill: {
          name: session.user?.name || "",
          email: session.user?.email || "",
        },
        theme: {
          color: "#6366f1",
        },
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response: any){
        toast.error(response.error.description || "Payment failed");
      });

      rzp.open();

    } catch (error: any) {
      toast.error(error.message || "Failed to initiate checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 px-4 bg-surface-950 mesh-gradient relative">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Simple, transparent <span className="gradient-text">pricing</span>
            </h1>
            <p className="text-lg text-surface-400 max-w-2xl mx-auto">
              Start for free, upgrade when you need more power. Our Pro plan helps cover the AI inference and infrastructure costs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="rounded-3xl bg-surface-900/50 border border-surface-800 p-8 flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <p className="text-surface-400 mb-6">Perfect for casual learners and occasional sharers.</p>
              
              <div className="mb-8">
                <span className="text-5xl font-bold">$0</span>
                <span className="text-surface-400">/month</span>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  "5 resource submissions per month",
                  "20 total bookmarks",
                  "Browse all public resources",
                  "Read AI summaries",
                  "Upvote and comment"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-surface-500 shrink-0 mt-0.5" />
                    <span className="text-surface-200">{feature}</span>
                  </li>
                ))}
                <li className="flex items-start gap-3 opacity-50">
                  <X size={20} className="text-surface-600 shrink-0 mt-0.5" />
                  <span className="text-surface-400 line-through">Personalized Weekly AI Digest</span>
                </li>
                <li className="flex items-start gap-3 opacity-50">
                  <X size={20} className="text-surface-600 shrink-0 mt-0.5" />
                  <span className="text-surface-400 line-through">Early Access to New Features</span>
                </li>
              </ul>
              
              <Button 
                variant="secondary" 
                size="lg" 
                className="w-full"
                onClick={() => !session ? router.push("/register") : router.push("/dashboard")}
              >
                {session ? "Current Plan" : "Get Started Free"}
              </Button>
            </div>

            {/* Pro Tier */}
            <div className="rounded-3xl bg-gradient-to-b from-primary-900/40 to-surface-900/80 border border-primary-500/30 p-8 flex flex-col relative transform md:-translate-y-4 shadow-2xl shadow-primary-500/10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-lg">
                  Most Popular
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold text-primary-400">Pro</h3>
                <Crown size={24} className="text-primary-400" />
              </div>
              <p className="text-surface-400 mb-6">For power users who want unlimited access and AI personalization.</p>
              
              <div className="mb-8">
                <span className="text-5xl font-bold text-white">$9</span>
                <span className="text-surface-400">/month</span>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  "Unlimited resource submissions",
                  "Unlimited bookmarks",
                  "Browse all public resources",
                  "Read AI summaries",
                  "Upvote and comment",
                  "Personalized Weekly AI Digest",
                  "Early Access to New Features",
                  "Pro Badge on profile"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-primary-400 shrink-0 mt-0.5" />
                    <span className="text-surface-100 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                variant="primary" 
                size="lg" 
                className="w-full gap-2 shadow-primary-500/25"
                onClick={handleUpgrade}
                loading={loading}
              >
                <Zap size={18} /> Upgrade to Pro
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
