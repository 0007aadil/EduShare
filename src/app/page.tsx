import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  BookOpen,
  Sparkles,
  Users,
  TrendingUp,
  Search,
  Shield,
  Zap,
  ArrowRight,
  Star,
  FileText,
  Video,
  Link as LinkIcon,
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden mesh-gradient">
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/8 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-8 animate-fade-in">
              <Sparkles size={14} />
              AI-Powered Learning Resource Platform
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
              Discover, Share &<br />
              <span className="gradient-text">Learn Together</span>
            </h1>

            <p className="text-lg sm:text-xl text-surface-400 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              A community-driven platform where students and developers find, share, and curate the best learning resources — enhanced by AI-powered summaries, smart tagging, and personalized recommendations.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-base shadow-lg shadow-primary-600/25 hover:shadow-primary-500/35 transition-all duration-200 active:scale-[0.98]"
              >
                Start Exploring
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/resources"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-surface-800/50 hover:bg-surface-800 text-surface-200 font-semibold text-base border border-surface-700 hover:border-surface-600 transition-all duration-200"
              >
                Browse Resources
              </Link>
            </div>

            {/* Stats bar */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
              {[
                { label: "Resources", value: "2,500+", icon: FileText },
                { label: "Contributors", value: "850+", icon: Users },
                { label: "Categories", value: "120+", icon: Star },
                { label: "AI Summaries", value: "10K+", icon: Sparkles },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-xl p-4 text-center">
                  <stat.icon size={18} className="mx-auto text-primary-400 mb-2" />
                  <p className="text-2xl font-bold text-surface-100">{stat.value}</p>
                  <p className="text-xs text-surface-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Everything You Need to <span className="gradient-text">Learn Smarter</span>
              </h2>
              <p className="text-surface-400 max-w-xl mx-auto">
                Powerful features designed to help you discover the best content and contribute to the community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
              {[
                {
                  icon: Sparkles,
                  title: "AI Summarization",
                  desc: "Every resource is automatically summarized by GPT-4o, so you know what you're getting before you click.",
                  color: "from-primary-500 to-primary-700",
                },
                {
                  icon: Search,
                  title: "Natural Language Search",
                  desc: "Search resources conversationally — 'Find me beginner Python tutorials about web scraping.'",
                  color: "from-accent-500 to-accent-600",
                },
                {
                  icon: Shield,
                  title: "Quality Moderation",
                  desc: "Every submission is reviewed by AI and human moderators to ensure only high-quality content makes it through.",
                  color: "from-warning-500 to-warning-600",
                },
                {
                  icon: Users,
                  title: "Community Driven",
                  desc: "Upvote, comment, and bookmark resources. Top contributors are recognized on our leaderboard.",
                  color: "from-primary-400 to-accent-500",
                },
                {
                  icon: Zap,
                  title: "Weekly AI Digest",
                  desc: "Pro members receive personalized weekly recommendations based on their interests and activity.",
                  color: "from-warning-500 to-primary-500",
                },
                {
                  icon: TrendingUp,
                  title: "Analytics Dashboard",
                  desc: "Track your contributions, monitor trending topics, and see your impact on the community.",
                  color: "from-accent-400 to-primary-500",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="group gradient-border bg-surface-900/60 rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon size={20} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-surface-100 mb-2">{feature.title}</h3>
                  <p className="text-sm text-surface-400 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Resource Types */}
        <section className="py-24 border-t border-surface-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                All Resource Types, <span className="gradient-text-emerald">One Platform</span>
              </h2>
              <p className="text-surface-400 max-w-xl mx-auto">
                Share links, articles, PDFs, and video tutorials — everything in one place, organized and searchable.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { icon: LinkIcon, label: "Links", desc: "Web resources & tutorials", color: "primary" },
                { icon: FileText, label: "Articles", desc: "Blog posts & guides", color: "accent" },
                { icon: FileText, label: "PDFs", desc: "Documents & papers", color: "warning" },
                { icon: Video, label: "Videos", desc: "Video tutorials", color: "danger" },
              ].map((type) => (
                <div
                  key={type.label}
                  className="glass rounded-2xl p-6 text-center hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                >
                  <div className={`h-14 w-14 rounded-2xl bg-${type.color}-500/15 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <type.icon size={24} className={`text-${type.color}-400`} />
                  </div>
                  <h3 className="font-semibold text-surface-100 mb-1">{type.label}</h3>
                  <p className="text-xs text-surface-500">{type.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative mesh-gradient">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-surface-400 mb-8 text-lg">
              Join thousands of learners and contributors. Share your knowledge, discover new resources, and grow together.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-base shadow-lg shadow-primary-600/25 hover:shadow-primary-500/35 transition-all duration-200 active:scale-[0.98] animate-pulse-glow"
            >
              Create Free Account
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
