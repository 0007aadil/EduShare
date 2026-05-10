"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Textarea } from "@/components/ui/Input";
import { 
  ArrowUp, 
  ArrowDown, 
  Bookmark, 
  MessageSquare, 
  ExternalLink, 
  Share2, 
  Flag,
  Calendar,
  Sparkles,
  Link as LinkIcon,
  FileText,
  Video
} from "lucide-react";
import { timeAgo, cn } from "@/lib/utils";
import toast from "react-hot-toast";

const typeIcons = {
  LINK: LinkIcon,
  ARTICLE: FileText,
  PDF: FileText,
  VIDEO: Video,
};

export default function ResourceDetailPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  
  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [commentInput, setCommentInput] = useState("");
  const [isVoting, setIsVoting] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const res = await fetch(`/api/resources/${id}`);
        const data = await res.json();
        
        if (data.success) {
          setResource(data.data);
        } else {
          toast.error("Resource not found");
          router.push("/resources");
        }
      } catch (error) {
        console.error("Error fetching resource:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchResource();
  }, [id, router]);

  const handleVote = async (type: "UP" | "DOWN") => {
    if (!session) return router.push("/login");
    
    setIsVoting(true);
    // Optimistic UI update
    const previousVote = resource.userVote;
    const previousNet = resource.netVotes;
    
    let newVote = type;
    let newNet = previousNet;
    
    if (previousVote === type) {
      newVote = null;
      newNet -= (type === "UP" ? 1 : -1);
    } else {
      if (previousVote) newNet -= (previousVote === "UP" ? 1 : -1);
      newNet += (type === "UP" ? 1 : -1);
    }

    setResource({ ...resource, userVote: newVote, netVotes: newNet });

    try {
      const res = await fetch(`/api/resources/${id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
    } catch (error) {
      // Revert optimistic update on error
      setResource({ ...resource, userVote: previousVote, netVotes: previousNet });
      toast.error("Failed to vote");
    } finally {
      setIsVoting(false);
    }
  };

  const handleBookmark = async () => {
    if (!session) return router.push("/login");
    
    setIsBookmarking(true);
    const previousState = resource.isBookmarked;
    setResource({ ...resource, isBookmarked: !previousState });

    try {
      const res = await fetch(`/api/resources/${id}/bookmark`, { method: "POST" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
    } catch (error: any) {
      setResource({ ...resource, isBookmarked: previousState });
      toast.error(error.message || "Failed to bookmark");
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return router.push("/login");
    if (!commentInput.trim()) return;

    setIsCommenting(true);
    try {
      const res = await fetch(`/api/resources/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentInput })
      });
      const data = await res.json();
      
      if (data.success) {
        setCommentInput("");
        setResource({
          ...resource,
          comments: [data.data, ...resource.comments]
        });
        toast.success("Comment posted");
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error("Failed to post comment");
    } finally {
      setIsCommenting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-950 pt-24">
        <div className="max-w-4xl mx-auto px-4 flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (!resource) return null;

  const TypeIcon = typeIcons[resource.type as keyof typeof typeIcons] || LinkIcon;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 bg-surface-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          {/* Header Section */}
          <div className="glass rounded-3xl p-6 sm:p-10 mb-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row gap-6 relative z-10">
              {/* Voting Column */}
              <div className="flex sm:flex-col items-center gap-2 sm:gap-4 sm:pr-6 sm:border-r border-surface-800">
                <button 
                  onClick={() => handleVote("UP")}
                  disabled={isVoting}
                  className={cn(
                    "p-3 rounded-xl transition-all",
                    resource.userVote === "UP" ? "bg-primary-500/20 text-primary-400" : "bg-surface-800/50 text-surface-400 hover:text-primary-400 hover:bg-surface-800"
                  )}
                >
                  <ArrowUp size={24} />
                </button>
                <span className={cn(
                  "text-xl font-bold w-12 text-center",
                  resource.userVote === "UP" ? "text-primary-400" : resource.userVote === "DOWN" ? "text-danger-500" : "text-surface-100"
                )}>
                  {resource.netVotes}
                </span>
                <button 
                  onClick={() => handleVote("DOWN")}
                  disabled={isVoting}
                  className={cn(
                    "p-3 rounded-xl transition-all",
                    resource.userVote === "DOWN" ? "bg-danger-500/20 text-danger-500" : "bg-surface-800/50 text-surface-400 hover:text-danger-500 hover:bg-surface-800"
                  )}
                >
                  <ArrowDown size={24} />
                </button>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="gap-1.5 px-3 py-1 bg-surface-900/50">
                      <TypeIcon size={14} className="text-surface-400" />
                      {resource.type}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-xs text-surface-400">
                      <Calendar size={14} />
                      {timeAgo(resource.createdAt)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-xl bg-surface-800/50 text-surface-400 hover:text-surface-100 hover:bg-surface-800 transition-colors tooltip-trigger relative">
                      <Share2 size={18} />
                    </button>
                    <button className="p-2 rounded-xl bg-surface-800/50 text-surface-400 hover:text-danger-500 hover:bg-danger-500/10 transition-colors">
                      <Flag size={18} />
                    </button>
                    <button 
                      onClick={handleBookmark}
                      disabled={isBookmarking}
                      className={cn(
                        "p-2 rounded-xl transition-colors",
                        resource.isBookmarked ? "bg-primary-500/20 text-primary-400" : "bg-surface-800/50 text-surface-400 hover:text-primary-400 hover:bg-surface-800"
                      )}
                    >
                      <Bookmark size={18} className={resource.isBookmarked ? "fill-current" : ""} />
                    </button>
                  </div>
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight">
                  {resource.title}
                </h1>

                {/* AI Summary Box */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-primary-900/20 to-accent-900/20 border border-primary-500/20 mb-6 relative">
                  <div className="absolute -top-3 -left-3 p-1.5 bg-surface-950 rounded-full border border-primary-500/30">
                    <Sparkles size={16} className="text-primary-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-primary-400 mb-2">AI Summary</h3>
                  <p className="text-surface-200 leading-relaxed text-sm">
                    {resource.summary || "No AI summary available."}
                  </p>
                </div>

                {resource.description && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-surface-400 mb-2">Submitter Notes</h3>
                    <p className="text-surface-200 leading-relaxed whitespace-pre-wrap text-sm">
                      {resource.description}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-surface-800/50">
                  <div className="flex items-center gap-3">
                    <Avatar src={resource.author.image} name={resource.author.name} size="md" />
                    <div>
                      <p className="text-sm font-medium text-surface-100">{resource.author.name}</p>
                      <p className="text-xs text-surface-500">Submitted this resource</p>
                    </div>
                  </div>

                  {(resource.url || resource.fileUrl) && (
                    <a 
                      href={resource.url || resource.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-medium transition-colors"
                    >
                      Open Resource
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-12">
            <h3 className="text-sm font-semibold text-surface-400 mb-3 uppercase tracking-wider">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {resource.tags.map(({ tag }: any) => (
                <Badge key={tag.id} variant="primary" className="px-3 py-1.5 text-sm">
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div id="comments" className="scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MessageSquare size={24} className="text-primary-400" />
              Discussion ({resource.comments.length})
            </h2>

            {/* Comment Form */}
            <div className="glass rounded-2xl p-6 mb-8">
              <div className="flex gap-4">
                <Avatar src={session?.user?.image} name={session?.user?.name} className="hidden sm:block" />
                <form onSubmit={handleComment} className="flex-1 space-y-3">
                  <Textarea
                    placeholder={session ? "Share your thoughts..." : "Sign in to leave a comment..."}
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    disabled={!session || isCommenting}
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={!session || !commentInput.trim() || isCommenting}
                      loading={isCommenting}
                    >
                      Post Comment
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Comment List */}
            <div className="space-y-6">
              {resource.comments.map((comment: any) => (
                <div key={comment.id} className="flex gap-4">
                  <Avatar src={comment.user.image} name={comment.user.name} size="sm" />
                  <div className="flex-1">
                    <div className="glass rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm text-surface-100">{comment.user.name}</span>
                        <span className="text-xs text-surface-500">{timeAgo(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm text-surface-200 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              {resource.comments.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-surface-800 rounded-2xl">
                  <p className="text-surface-400">No comments yet. Be the first to start the discussion!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
