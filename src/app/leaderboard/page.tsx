"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Trophy, Star, ArrowUp, Zap, Target } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from a /api/leaderboard endpoint
    // For demo purposes, we'll simulate the data
    const fetchLeaderboard = async () => {
      setLoading(true);
      setTimeout(() => {
        setLeaders([
          { id: "1", name: "Sarah Chen", image: null, role: "CONTRIBUTOR", score: 2450, approvedCount: 156, totalUpvotes: 890, avgQualityScore: 92 },
          { id: "2", name: "Alex Kumar", image: null, role: "CONTRIBUTOR", score: 2120, approvedCount: 132, totalUpvotes: 750, avgQualityScore: 88 },
          { id: "3", name: "Maria Garcia", image: null, role: "USER", score: 1850, approvedCount: 98, totalUpvotes: 620, avgQualityScore: 90 },
          { id: "4", name: "David Kim", image: null, role: "USER", score: 1540, approvedCount: 85, totalUpvotes: 510, avgQualityScore: 85 },
          { id: "5", name: "Emma Wilson", image: null, role: "USER", score: 1200, approvedCount: 64, totalUpvotes: 420, avgQualityScore: 82 },
        ] as any);
        setLoading(false);
      }, 800);
    };

    fetchLeaderboard();
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 bg-surface-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-warning-500/20 to-warning-600/20 text-warning-500 mb-4 ring-1 ring-warning-500/30">
              <Trophy size={32} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Top Contributors</h1>
            <p className="text-surface-400 max-w-xl mx-auto">
              Recognizing the community members who share the highest quality resources. 
              Top users are automatically promoted to <span className="text-accent-400 font-medium">Contributor</span> status.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card variant="glass" padding="md" className="text-center">
              <Target size={24} className="text-primary-400 mx-auto mb-2" />
              <h3 className="font-medium text-surface-200 mb-1">Score Formula</h3>
              <p className="text-xs text-surface-500">
                (Approved × 10) + (Avg. Quality × 0.5) + (Upvotes × 2)
              </p>
            </Card>
            <Card variant="glass" padding="md" className="text-center">
              <Zap size={24} className="text-accent-400 mx-auto mb-2" />
              <h3 className="font-medium text-surface-200 mb-1">Contributor Role</h3>
              <p className="text-xs text-surface-500">
                Reach 2,000 score to unlock instant approvals
              </p>
            </Card>
            <Card variant="glass" padding="md" className="text-center">
              <Star size={24} className="text-warning-500 mx-auto mb-2" />
              <h3 className="font-medium text-surface-200 mb-1">Weekly Reset</h3>
              <p className="text-xs text-surface-500">
                Scores accumulate indefinitely, ranks update daily
              </p>
            </Card>
          </div>

          <Card variant="glass" padding="none" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-surface-800 bg-surface-900/50">
                    <th className="py-4 px-6 font-medium text-sm text-surface-400 w-16 text-center">Rank</th>
                    <th className="py-4 px-6 font-medium text-sm text-surface-400">User</th>
                    <th className="py-4 px-6 font-medium text-sm text-surface-400 text-right">Approved</th>
                    <th className="py-4 px-6 font-medium text-sm text-surface-400 text-right">Avg Quality</th>
                    <th className="py-4 px-6 font-medium text-sm text-surface-400 text-right">Upvotes</th>
                    <th className="py-4 px-6 font-medium text-sm text-surface-400 text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-800/50">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse bg-surface-900/20">
                        <td className="py-5 px-6"><div className="h-6 w-6 bg-surface-800 rounded-full mx-auto" /></td>
                        <td className="py-5 px-6 flex items-center gap-3">
                          <div className="h-10 w-10 bg-surface-800 rounded-full" />
                          <div className="h-4 w-24 bg-surface-800 rounded" />
                        </td>
                        <td className="py-5 px-6"><div className="h-4 w-8 bg-surface-800 rounded ml-auto" /></td>
                        <td className="py-5 px-6"><div className="h-4 w-8 bg-surface-800 rounded ml-auto" /></td>
                        <td className="py-5 px-6"><div className="h-4 w-8 bg-surface-800 rounded ml-auto" /></td>
                        <td className="py-5 px-6"><div className="h-4 w-12 bg-surface-800 rounded ml-auto" /></td>
                      </tr>
                    ))
                  ) : (
                    leaders.map((leader: any, index) => (
                      <tr key={leader.id} className="hover:bg-surface-800/30 transition-colors">
                        <td className="py-4 px-6 text-center">
                          <span className={cn(
                            "inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm",
                            index === 0 ? "bg-warning-500/20 text-warning-500 ring-1 ring-warning-500/30" :
                            index === 1 ? "bg-surface-400/20 text-surface-300 ring-1 ring-surface-400/30" :
                            index === 2 ? "bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/30" :
                            "text-surface-500"
                          )}>
                            {index + 1}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <Avatar src={leader.image} name={leader.name} size="md" />
                            <div>
                              <p className="font-medium text-surface-100">{leader.name}</p>
                              {leader.role === "CONTRIBUTOR" && (
                                <span className="text-[10px] uppercase tracking-wider font-semibold text-accent-400">
                                  Contributor
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right text-surface-300">{leader.approvedCount}</td>
                        <td className="py-4 px-6 text-right">
                          <span className={cn(
                            "text-sm font-medium",
                            leader.avgQualityScore >= 90 ? "text-primary-400" : "text-surface-300"
                          )}>
                            {leader.avgQualityScore}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right text-surface-300">
                          <div className="flex items-center justify-end gap-1">
                            <ArrowUp size={14} className="text-surface-500" />
                            {leader.totalUpvotes}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className="font-bold text-surface-100">{leader.score.toLocaleString()}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
