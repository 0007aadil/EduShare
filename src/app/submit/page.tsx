"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Card } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Link as LinkIcon, FileText, Video, UploadCloud, X, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const resourceTypes = [
  { id: "LINK", label: "Web Link", icon: LinkIcon, desc: "Articles, tutorials, repos" },
  { id: "PDF", label: "PDF Document", icon: FileText, desc: "Cheatsheets, papers" },
  { id: "ARTICLE", label: "Text Article", icon: FileText, desc: "Write directly here" },
  { id: "VIDEO", label: "Video", icon: Video, desc: "YouTube, Vimeo links" },
];

export default function SubmitPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"LINK" | "PDF" | "ARTICLE" | "VIDEO">("LINK");
  
  const [form, setForm] = useState({
    title: "",
    url: "",
    description: "",
  });
  
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!tags.includes(newTag) && tags.length < 5) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let fileUrl = undefined;

      // Handle PDF upload
      if (type === "PDF" && file) {
        const formData = new FormData();
        formData.append("file", file);
        
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        
        if (!uploadRes.ok) throw new Error("File upload failed");
        const uploadData = await uploadRes.json();
        fileUrl = uploadData.secure_url;
      }

      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          type,
          tags,
          fileUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to submit resource");
        return;
      }

      toast.success(
        <div className="flex flex-col gap-1">
          <span className="font-semibold">Resource submitted successfully!</span>
          <span className="text-xs text-surface-200">Our AI is processing it now.</span>
        </div>
      );
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-4 mesh-gradient">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Submit a Resource</h1>
            <p className="text-surface-400">Share knowledge with the community. Our AI will automatically summarize and score your submission.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Type Selection */}
            <section>
              <h2 className="text-sm font-semibold text-surface-300 mb-3 uppercase tracking-wider">1. Resource Type</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {resourceTypes.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id as any)}
                    className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      type === t.id
                        ? "bg-primary-500/10 border-primary-500 shadow-lg shadow-primary-500/10"
                        : "bg-surface-900/50 border-surface-800 hover:border-surface-600 hover:bg-surface-800"
                    }`}
                  >
                    <t.icon size={20} className={`mb-3 ${type === t.id ? "text-primary-400" : "text-surface-500"}`} />
                    <h3 className={`font-medium text-sm mb-1 ${type === t.id ? "text-primary-400" : "text-surface-200"}`}>{t.label}</h3>
                    <p className="text-xs text-surface-500">{t.desc}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* Core Info */}
            <Card variant="glass" padding="lg">
              <h2 className="text-sm font-semibold text-surface-300 mb-6 uppercase tracking-wider">2. Core Information</h2>
              <div className="space-y-6">
                <Input
                  label="Title"
                  placeholder="e.g., Complete Guide to React Server Components"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />

                {(type === "LINK" || type === "VIDEO") && (
                  <Input
                    label="URL"
                    type="url"
                    placeholder="https://..."
                    value={form.url}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                    required
                  />
                )}

                {type === "PDF" && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-surface-300">Upload PDF</label>
                    <div className="border-2 border-dashed border-surface-700 rounded-xl p-8 text-center hover:bg-surface-800/50 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        id="pdf-upload"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                      />
                      <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center">
                        <UploadCloud size={32} className="text-primary-400 mb-3" />
                        <span className="text-sm font-medium text-surface-200 mb-1">
                          {file ? file.name : "Click to upload or drag and drop"}
                        </span>
                        <span className="text-xs text-surface-500">PDF up to 10MB</span>
                      </label>
                    </div>
                  </div>
                )}

                <Textarea
                  label="Description (Optional)"
                  placeholder="Add your own notes or context. If left blank, our AI will generate a summary."
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />

                {/* Tags */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-surface-300">
                    Tags <span className="text-surface-500 font-normal">(Press enter to add)</span>
                  </label>
                  <div className="p-2 bg-surface-800/50 border border-surface-700 rounded-xl focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/50 transition-all flex flex-wrap gap-2 items-center">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="primary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:bg-primary-500/20 rounded-full p-0.5"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      className="flex-1 bg-transparent border-none focus:outline-none text-sm min-w-[120px] px-2"
                      placeholder={tags.length < 5 ? "Add a tag..." : "Max 5 tags reached"}
                      disabled={tags.length >= 5}
                    />
                  </div>
                  <p className="text-xs text-surface-500 flex items-center gap-1 mt-2">
                    <Sparkles size={12} className="text-primary-400" />
                    If left empty, AI will suggest tags automatically.
                  </p>
                </div>
              </div>
            </Card>

            <div className="flex justify-end gap-4 pt-4 border-t border-surface-800">
              <Button type="button" variant="ghost" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" loading={loading} size="lg" className="min-w-[150px]">
                Submit Resource
              </Button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
