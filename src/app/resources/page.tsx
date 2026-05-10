"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ResourceCard } from "@/components/features/ResourceCard";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Search, Filter, Sparkles, SlidersHorizontal, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "React", "Next.js", "TypeScript", "Node.js", "Python", "Machine Learning", "UI/UX", "Database"];
const TYPES = [
  { id: "ALL", label: "All Types" },
  { id: "LINK", label: "Links" },
  { id: "PDF", label: "PDFs" },
  { id: "ARTICLE", label: "Articles" },
  { id: "VIDEO", label: "Videos" }
];
const SORTS = [
  { id: "newest", label: "Newest First" },
  { id: "popular", label: "Most Popular" },
  { id: "quality", label: "Highest Quality (AI)" }
];

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nlpLoading, setNlpLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [filters, setFilters] = useState({ type: "ALL", sort: "newest" });
  const [showFilters, setShowFilters] = useState(false);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.set("search", search);
      if (activeCategory !== "All") queryParams.set("tag", activeCategory.toLowerCase());
      if (filters.type !== "ALL") queryParams.set("type", filters.type);
      queryParams.set("sort", filters.sort);

      const res = await fetch(`/api/resources?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success) {
        setResources(data.data.items);
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch and fetch on filter changes (excluding pure search typing)
    const timeoutId = setTimeout(() => {
      fetchResources();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [search, activeCategory, filters]);

  const handleNLPSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;

    setNlpLoading(true);
    // In a full implementation, this would call /api/ai/search 
    // to extract intents and then fetch filtered resources.
    // For demo, we just simulate the delay and use regular text search.
    setTimeout(() => {
      fetchResources();
      setNlpLoading(false);
    }, 1000);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 bg-surface-950">
        
        {/* Search Header */}
        <div className="bg-surface-900 border-b border-surface-800 sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <h1 className="text-3xl font-bold mb-6">Explore Resources</h1>
            
            <form onSubmit={handleNLPSearch} className="relative max-w-3xl flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={20} />
                <input
                  type="text"
                  placeholder="Ask anything... e.g., 'Find me beginner React tutorials with high AI scores'"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-surface-950 border border-surface-700 text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Badge variant="primary" className="hidden sm:flex">
                    <Sparkles size={12} className="mr-1" /> AI Search
                  </Badge>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="p-3.5 rounded-xl border border-surface-700 bg-surface-950 text-surface-300 hover:text-surface-100 hover:bg-surface-800 transition-colors cursor-pointer"
              >
                <SlidersHorizontal size={20} />
              </button>
            </form>

            {/* Quick Categories */}
            <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                    activeCategory === category 
                      ? "bg-primary-600 text-white" 
                      : "bg-surface-800/50 text-surface-300 hover:bg-surface-800 hover:text-surface-100"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-6 mt-4 border-t border-surface-800 animate-fade-in">
                <div>
                  <label className="block text-xs font-medium text-surface-400 mb-2 uppercase tracking-wider">Resource Type</label>
                  <select 
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                    className="w-full p-2.5 rounded-xl bg-surface-950 border border-surface-700 text-sm focus:outline-none focus:border-primary-500 cursor-pointer"
                  >
                    {TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-400 mb-2 uppercase tracking-wider">Sort By</label>
                  <select 
                    value={filters.sort}
                    onChange={(e) => setFilters({...filters, sort: e.target.value})}
                    className="w-full p-2.5 rounded-xl bg-surface-950 border border-surface-700 text-sm focus:outline-none focus:border-primary-500 cursor-pointer"
                  >
                    {SORTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {loading || nlpLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={40} className="text-primary-500 animate-spin mb-4" />
              <p className="text-surface-400 text-sm animate-pulse">
                {nlpLoading ? "AI is analyzing your request..." : "Loading resources..."}
              </p>
            </div>
          ) : resources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {resources.map((resource: any) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 glass rounded-2xl">
              <Filter size={48} className="text-surface-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-surface-200 mb-2">No resources found</h3>
              <p className="text-surface-500 max-w-md mx-auto">
                We couldn't find any resources matching your criteria. Try adjusting your search or filters.
              </p>
              <button 
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                  setFilters({ type: "ALL", sort: "newest" });
                }}
                className="mt-6 px-6 py-2 rounded-xl bg-surface-800 text-surface-200 hover:bg-surface-700 transition-colors font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
