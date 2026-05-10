import Link from "next/link";
import { ResourceWithRelations } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { ArrowUp, MessageSquare, Bookmark, Link as LinkIcon, FileText, Video, ExternalLink } from "lucide-react";
import { cn, timeAgo, truncate } from "@/lib/utils";

interface ResourceCardProps {
  resource: ResourceWithRelations;
  showStatus?: boolean;
}

const typeIcons = {
  LINK: LinkIcon,
  ARTICLE: FileText,
  PDF: FileText,
  VIDEO: Video,
};

const statusColors = {
  PENDING: "warning",
  APPROVED: "primary",
  REJECTED: "danger",
} as const;

export function ResourceCard({ resource, showStatus = false }: ResourceCardProps) {
  const TypeIcon = typeIcons[resource.type];
  const netVotes = (resource._count?.votes || 0); // Simplified for UI, real app would pass up/down
  const scoreColor = resource.qualityScore && resource.qualityScore >= 80 ? "text-primary-400" : resource.qualityScore && resource.qualityScore >= 50 ? "text-warning-500" : "text-danger-500";

  return (
    <Card hover className="flex flex-col h-full group relative overflow-hidden">
      {/* Type Indicator */}
      <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
        <TypeIcon size={20} className="text-surface-600 group-hover:text-primary-500 transition-colors" />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-4 pr-8">
        <Link href={`/resources/${resource.id}`} className="block flex-1">
          <h3 className="text-lg font-semibold text-surface-100 group-hover:text-primary-400 transition-colors line-clamp-2 leading-tight mb-2">
            {resource.title}
          </h3>
          {showStatus && (
            <Badge variant={statusColors[resource.status]} className="mb-2">
              {resource.status}
            </Badge>
          )}
        </Link>
      </div>

      {/* AI Summary / Description */}
      <p className="text-sm text-surface-400 line-clamp-3 mb-4 flex-1">
        {resource.summary || resource.description || "No description provided."}
      </p>

      {/* Tags */}
      {resource.tags && resource.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {resource.tags.slice(0, 3).map(({ tag }) => (
            <Badge key={tag.id} variant="outline" className="text-[10px]">
              {tag.name}
            </Badge>
          ))}
          {resource.tags.length > 3 && (
            <Badge variant="outline" className="text-[10px] text-surface-500">
              +{resource.tags.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-auto pt-4 border-t border-surface-800/50 flex flex-col gap-3">
        {/* Quality Score & Meta */}
        <div className="flex items-center justify-between text-xs text-surface-500">
          <div className="flex items-center gap-2">
            <Avatar src={resource.author.image} name={resource.author.name} size="sm" className="w-5 h-5" />
            <span className="truncate max-w-[100px]">{resource.author.name}</span>
            <span>•</span>
            <span>{timeAgo(resource.createdAt)}</span>
          </div>
          {resource.qualityScore && (
            <div className={`font-medium ${scoreColor} flex items-center gap-1 bg-surface-900/50 px-2 py-0.5 rounded-md`}>
              <span>AI Score: {resource.qualityScore}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between text-surface-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 hover:text-primary-400 transition-colors cursor-pointer group/action">
              <div className="p-1.5 rounded-lg group-hover/action:bg-primary-500/10 transition-colors">
                <ArrowUp size={16} />
              </div>
              <span className="text-sm font-medium">{netVotes}</span>
            </div>
            <Link href={`/resources/${resource.id}#comments`} className="flex items-center gap-1.5 hover:text-primary-400 transition-colors cursor-pointer group/action">
               <div className="p-1.5 rounded-lg group-hover/action:bg-primary-500/10 transition-colors">
                <MessageSquare size={16} />
               </div>
              <span className="text-sm font-medium">{resource._count?.comments || 0}</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-lg hover:text-primary-400 hover:bg-primary-500/10 transition-colors cursor-pointer">
              <Bookmark size={16} />
            </button>
            {(resource.url || resource.fileUrl) && (
               <a 
                href={resource.url || resource.fileUrl || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:text-primary-400 hover:bg-primary-500/10 transition-colors cursor-pointer"
               >
                 <ExternalLink size={16} />
               </a>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
