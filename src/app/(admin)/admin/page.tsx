"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { 
  LayoutDashboard, 
  Users, 
  Flag, 
  ShieldCheck, 
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";
import toast from "react-hot-toast";

const navLinks = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "moderation", label: "Moderation Queue", icon: ShieldCheck },
  { id: "users", label: "Users", icon: Users },
  { id: "flags", label: "Flags", icon: Flag },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("moderation");
  const [pendingResources, setPendingResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, this would be a dedicated admin API route
    // For demo, we use the public one with status=PENDING
    const fetchPending = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/resources?status=PENDING');
        const data = await res.json();
        if (data.success) {
          setPendingResources(data.data.items);
        }
      } catch (error) {
        console.error("Error fetching pending:", error);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "moderation") {
      fetchPending();
    }
  }, [activeTab]);

  const handleModeration = async (resourceId: string, status: "APPROVED" | "REJECTED") => {
    setActionLoading(resourceId);
    try {
      // In a real app, this would call an admin-specific PATCH route
      // Simulating the API call
      await new Promise(r => setTimeout(r, 800));
      
      setPendingResources(prev => prev.filter((r: any) => r.id !== resourceId));
      toast.success(`Resource ${status.toLowerCase()}`);
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  if (session?.user && (session.user as any).role !== "ADMIN") {
    return <div className="p-8 text-center">Unauthorized</div>;
  }

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col md:flex-row">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 border-r border-surface-800 bg-surface-900/50 flex-shrink-0">
        <div className="p-6">
          <Link href="/" className="text-xl font-bold tracking-tight mb-8 block">
            Edu<span className="gradient-text">Share</span> Admin
          </Link>
          
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  activeTab === link.id
                    ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20"
                    : "text-surface-400 hover:text-surface-100 hover:bg-surface-800"
                )}
              >
                <link.icon size={18} />
                {link.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-bold capitalize">
            {navLinks.find(l => l.id === activeTab)?.label}
          </h1>
          <div className="flex items-center gap-4">
            <Avatar src={session?.user?.image} name={session?.user?.name} size="sm" />
          </div>
        </header>

        {activeTab === "moderation" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <p className="text-surface-400">
                Review submissions before they appear on the public platform.
              </p>
              <Badge variant="warning">{pendingResources.length} Pending</Badge>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-40 bg-surface-800/50 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : pendingResources.length > 0 ? (
              <div className="space-y-6">
                {pendingResources.map((resource: any) => (
                  <Card key={resource.id} padding="lg" className="border-l-4 border-l-warning-500">
                    <div className="flex flex-col xl:flex-row gap-6">
                      
                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline">{resource.type}</Badge>
                          <span className="text-xs text-surface-500 flex items-center gap-1">
                            <Clock size={12} /> {timeAgo(resource.createdAt)}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                        
                        <div className="flex items-center gap-2 mb-4 text-sm text-surface-400">
                          <span>Submitted by:</span>
                          <Avatar src={resource.author.image} name={resource.author.name} size="sm" className="w-5 h-5" />
                          <span className="font-medium text-surface-200">{resource.author.name}</span>
                        </div>

                        {(resource.url || resource.fileUrl) && (
                          <a 
                            href={resource.url || resource.fileUrl} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-primary-400 hover:text-primary-300 transition-colors mb-4"
                          >
                            <ExternalLink size={14} /> View Original Content
                          </a>
                        )}
                      </div>

                      {/* AI Assessment */}
                      <div className="flex-1 bg-surface-900/50 rounded-xl p-4 border border-surface-800">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles size={16} className="text-primary-400" />
                          <span className="text-sm font-semibold text-primary-400">AI Assessment</span>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex-1">
                            <div className="text-xs text-surface-500 mb-1">Quality Score</div>
                            <div className="flex items-center gap-2">
                              <div className="h-2 flex-1 bg-surface-800 rounded-full overflow-hidden">
                                <div 
                                  className={cn(
                                    "h-full rounded-full",
                                    resource.qualityScore >= 80 ? "bg-primary-500" : resource.qualityScore >= 50 ? "bg-warning-500" : "bg-danger-500"
                                  )}
                                  style={{ width: `${resource.qualityScore}%` }}
                                />
                              </div>
                              <span className="text-sm font-bold">{resource.qualityScore}/100</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-surface-500 mb-1">Suggested Tags</div>
                        <div className="flex flex-wrap gap-1">
                          {resource.tags.map(({ tag }: any) => (
                            <Badge key={tag.id} variant="default" className="text-[10px]">
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex xl:flex-col items-center justify-center gap-3 border-t xl:border-t-0 xl:border-l border-surface-800 pt-4 xl:pt-0 xl:pl-6 min-w-[140px]">
                        <Button 
                          className="w-full justify-center gap-2" 
                          onClick={() => handleModeration(resource.id, "APPROVED")}
                          loading={actionLoading === resource.id}
                          disabled={actionLoading !== null}
                        >
                          <CheckCircle size={16} /> Approve
                        </Button>
                        <Button 
                          variant="danger" 
                          className="w-full justify-center gap-2"
                          onClick={() => handleModeration(resource.id, "REJECTED")}
                          disabled={actionLoading !== null}
                        >
                          <XCircle size={16} /> Reject
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-surface-800 rounded-2xl">
                <ShieldCheck size={48} className="text-surface-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-surface-200">Queue is empty</h3>
                <p className="text-surface-500">All pending resources have been reviewed.</p>
              </div>
            )}
          </div>
        )}

        {/* Placeholders for other tabs */}
        {activeTab !== "moderation" && (
          <div className="text-center py-20 border-2 border-dashed border-surface-800 rounded-2xl">
            <h3 className="text-lg font-medium text-surface-200 mb-2">{navLinks.find(l => l.id === activeTab)?.label}</h3>
            <p className="text-surface-500">This module is part of a future implementation phase.</p>
          </div>
        )}

      </main>
    </div>
  );
}
