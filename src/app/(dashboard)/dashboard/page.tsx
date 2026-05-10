"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { ResourceCard } from "@/components/features/ResourceCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { 
  FileText, 
  Bookmark, 
  MessageSquare, 
  ArrowUp, 
  TrendingUp, 
  Clock, 
  Star,
  Settings,
  Zap
} from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const [activeTab, setActiveTab] = useState<"submissions" | "bookmarks">("submissions");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    submitted: 0,
    approved: 0,
    votes: 0,
    bookmarks: 0
  });

  useEffect(() => {
    if (!user) return;
    
    // In a real app, this would fetch from an API endpoint specific to the dashboard
    // For now, we'll use the main resources endpoint with authorId filter
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch user stats (mocked for now, would be a real API call)
        setStats({
          submitted: 12,
          approved: 8,
          votes: 145,
          bookmarks: 32
        });

        // Fetch submissions or bookmarks
        const res = await fetch(`/api/resources`); // Simplified for demo
        const data = await res.json();
        
        if (data.success) {
          setResources(data.data.items);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, activeTab]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-4 bg-surface-950">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar / Profile Info */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
            <Card padding="lg" className="text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary-600 to-primary-900 opacity-20" />
              
              <div className="relative z-10 flex flex-col items-center">
                <Avatar src={user?.image} name={user?.name} size="lg" className="mb-4 ring-4 ring-surface-900 shadow-xl" />
                <h2 className="text-xl font-bold text-surface-100">{user?.name}</h2>
                <p className="text-sm text-surface-400 mb-4">{user?.email}</p>
                
                <div className="flex items-center gap-2 mb-6">
                  <Badge variant={user?.role === "ADMIN" ? "danger" : user?.role === "CONTRIBUTOR" ? "accent" : "primary"}>
                    {user?.role}
                  </Badge>
                  <Badge variant={user?.tier === "PRO" ? "warning" : "default"} className={user?.tier === "PRO" ? "shadow-[0_0_10px_rgba(245,158,11,0.3)]" : ""}>
                    {user?.tier === "PRO" ? "PRO MEMBER" : "FREE TIER"}
                  </Badge>
                </div>

                {user?.tier !== "PRO" && (
                  <div className="w-full p-4 rounded-xl bg-surface-800/50 border border-surface-700 text-left mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-surface-200">Submissions</span>
                      <span className="text-xs text-surface-400">3/5 this month</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-700 rounded-full overflow-hidden mb-3">
                      <div className="h-full bg-primary-500 w-[60%]" />
                    </div>
                    <Link href="/pricing" className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 font-medium transition-colors">
                      <Zap size={12} />
                      Upgrade to Pro for unlimited
                    </Link>
                  </div>
                )}
              </div>
            </Card>

            <Card padding="md" className="space-y-4">
              <h3 className="text-sm font-semibold text-surface-300 uppercase tracking-wider mb-2">Overview</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-surface-800/50 border border-surface-700">
                  <FileText size={16} className="text-primary-400 mb-1" />
                  <p className="text-2xl font-bold text-surface-100">{stats.submitted}</p>
                  <p className="text-xs text-surface-500">Submitted</p>
                </div>
                <div className="p-3 rounded-xl bg-surface-800/50 border border-surface-700">
                  <Star size={16} className="text-accent-400 mb-1" />
                  <p className="text-2xl font-bold text-surface-100">{stats.approved}</p>
                  <p className="text-xs text-surface-500">Approved</p>
                </div>
                <div className="p-3 rounded-xl bg-surface-800/50 border border-surface-700">
                  <ArrowUp size={16} className="text-warning-500 mb-1" />
                  <p className="text-2xl font-bold text-surface-100">{stats.votes}</p>
                  <p className="text-xs text-surface-500">Upvotes</p>
                </div>
                <div className="p-3 rounded-xl bg-surface-800/50 border border-surface-700">
                  <Bookmark size={16} className="text-primary-400 mb-1" />
                  <p className="text-2xl font-bold text-surface-100">{stats.bookmarks}</p>
                  <p className="text-xs text-surface-500">Bookmarks</p>
                </div>
              </div>
            </Card>

            <div className="space-y-1">
              <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-surface-300 hover:text-surface-100 hover:bg-surface-800/50 transition-colors">
                <Settings size={18} />
                <span className="font-medium">Account Settings</span>
              </Link>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-surface-100">Your Dashboard</h1>
              
              <div className="flex items-center p-1 bg-surface-900 rounded-lg border border-surface-800">
                <button
                  onClick={() => setActiveTab("submissions")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "submissions" ? "bg-surface-700 text-surface-100 shadow-sm" : "text-surface-400 hover:text-surface-200"
                  }`}
                >
                  My Submissions
                </button>
                <button
                  onClick={() => setActiveTab("bookmarks")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "bookmarks" ? "bg-surface-700 text-surface-100 shadow-sm" : "text-surface-400 hover:text-surface-200"
                  }`}
                >
                  Bookmarks
                </button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-[300px] rounded-2xl bg-surface-800/20 animate-pulse border border-surface-800" />
                ))}
              </div>
            ) : resources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {resources.map((resource: any) => (
                  <ResourceCard 
                    key={resource.id} 
                    resource={resource} 
                    showStatus={activeTab === "submissions"} 
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center glass rounded-2xl border-dashed">
                <div className="h-16 w-16 rounded-full bg-surface-800 flex items-center justify-center mb-4">
                  {activeTab === "submissions" ? <FileText size={24} className="text-surface-400" /> : <Bookmark size={24} className="text-surface-400" />}
                </div>
                <h3 className="text-lg font-semibold text-surface-200 mb-2">
                  {activeTab === "submissions" ? "No submissions yet" : "No bookmarks yet"}
                </h3>
                <p className="text-surface-500 max-w-md mb-6">
                  {activeTab === "submissions" 
                    ? "You haven't submitted any resources yet. Share a valuable link or document with the community!"
                    : "You haven't bookmarked any resources. Explore the platform and save items you want to revisit."}
                </p>
                <Link href={activeTab === "submissions" ? "/submit" : "/resources"}>
                  <button className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-medium transition-colors">
                    {activeTab === "submissions" ? "Submit Resource" : "Explore Resources"}
                  </button>
                </Link>
              </div>
            )}
          </div>

        </div>
      </main>
    </>
  );
}
